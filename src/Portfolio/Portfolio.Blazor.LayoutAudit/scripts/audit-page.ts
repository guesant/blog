export type Violation = {
    type:
        | "overflow-x"
        | "overflow-y"
        | "gap-missing"
        | "gap-overlap"
        | "gap-flush"
        | "block-overlap"
        | "text-clipped"
        | "control-underfilled";
    selector: string;
    parentSelector: string;
    actual: number;
    expected: number;
};

export function openAllDisclosures(): void {
    for (const trigger of Array.from(
        document.querySelectorAll('.site-disclosure-summary[data-state="closed"]'),
    )) {
        trigger.setAttribute("data-state", "open");
        trigger.setAttribute("aria-expanded", "true");
    }
    for (const panel of Array.from(
        document.querySelectorAll('.site-disclosure-content[data-state="closed"]'),
    )) {
        panel.setAttribute("data-state", "open");
        panel.removeAttribute("aria-hidden");
    }
}

export function auditPage(): Violation[] {
    const TOLERANCE = 2;
    const MIN_SENSIBLE_GAP = 4;
    const FLOW_BREAKING_POSITIONS = new Set(["absolute", "fixed", "sticky"]);

    function selectorFor(el: Element): string {
        const parts: string[] = [];
        let node: Element | null = el;
        while (node && node !== document.body && node.parentElement) {
            let part = node.tagName.toLowerCase();
            if (node.id) {
                part += `#${node.id}`;
            } else {
                const cls = (node.getAttribute("class") || "").split(/\s+/).filter(Boolean)[0];
                if (cls) part += `.${cls}`;
                const matchingSiblings = Array.from(node.parentElement.children).filter(
                    (sib) =>
                        sib.tagName === node!.tagName &&
                        (sib.getAttribute("class") || "").split(/\s+/).filter(Boolean)[0] === cls,
                );
                if (matchingSiblings.length > 1) {
                    part += `:nth-of-type(${matchingSiblings.indexOf(node) + 1})`;
                }
            }
            parts.unshift(part);
            node = node.parentElement;
        }
        return `body > ${parts.join(" > ")}`;
    }

    function isFlowParticipant(el: Element): boolean {
        const style = getComputedStyle(el);
        if (style.display === "none" || style.display === "contents") return false;
        if (FLOW_BREAKING_POSITIONS.has(style.position)) return false;
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return false;
        return true;
    }

    function allowsOverflow(overflow: string): boolean {
        return overflow === "visible" || overflow === "auto" || overflow === "scroll";
    }

    const violations: Violation[] = [];
    const allElements = Array.from(document.body.querySelectorAll("*"));

    for (const el of allElements) {
        if (!isFlowParticipant(el)) continue;
        const parent = el.parentElement;
        if (!parent || parent === document.documentElement) continue;

        const parentStyle = getComputedStyle(parent);
        if (parentStyle.display === "contents") continue;
        const rect = el.getBoundingClientRect();
        const parentRect = parent.getBoundingClientRect();
        const borderLeft = parseFloat(parentStyle.borderLeftWidth) || 0;
        const borderRight = parseFloat(parentStyle.borderRightWidth) || 0;
        const borderTop = parseFloat(parentStyle.borderTopWidth) || 0;
        const borderBottom = parseFloat(parentStyle.borderBottomWidth) || 0;

        const contentLeft = parentRect.left + borderLeft;
        const contentRight = parentRect.right - borderRight;
        const contentTop = parentRect.top + borderTop;
        const contentBottom = parentRect.bottom - borderBottom;

        const overflowX = parentStyle.overflowX;
        const overflowY = parentStyle.overflowY;

        if (!allowsOverflow(overflowX)) {
            const escapeLeft = contentLeft - rect.left;
            const escapeRight = rect.right - contentRight;
            const escape = Math.max(escapeLeft, escapeRight);
            if (escape > TOLERANCE) {
                violations.push({
                    type: "overflow-x",
                    selector: selectorFor(el),
                    parentSelector: selectorFor(parent),
                    actual: Math.round(escape),
                    expected: 0,
                });
            }
        }

        if (!allowsOverflow(overflowY)) {
            const escapeTop = contentTop - rect.top;
            const escapeBottom = rect.bottom - contentBottom;
            const escape = Math.max(escapeTop, escapeBottom);
            if (escape > TOLERANCE) {
                violations.push({
                    type: "overflow-y",
                    selector: selectorFor(el),
                    parentSelector: selectorFor(parent),
                    actual: Math.round(escape),
                    expected: 0,
                });
            }
        }
    }

    const candidateParents = [document.body, ...allElements];
    for (const parent of candidateParents) {
        const parentStyle = getComputedStyle(parent);
        const children = Array.from(parent.children).filter(isFlowParticipant);
        if (children.length < 2) continue;

        const display = parentStyle.display;
        const isFlex = display === "flex" || display === "inline-flex";
        const isGrid = display === "grid" || display === "inline-grid";

        if (isFlex || isGrid) {
            const rowGap = parseFloat(parentStyle.rowGap) || 0;
            const columnGap = parseFloat(parentStyle.columnGap) || 0;

            const byTop = [...children].sort(
                (a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top,
            );
            const rows: Element[][] = [];
            let rowTop = 0;
            let rowBottom = 0;
            for (const child of byTop) {
                const r = child.getBoundingClientRect();
                if (rows.length > 0 && r.top < rowBottom && rowTop < r.bottom) {
                    rows[rows.length - 1].push(child);
                    rowTop = Math.min(rowTop, r.top);
                    rowBottom = Math.max(rowBottom, r.bottom);
                } else {
                    rows.push([child]);
                    rowTop = r.top;
                    rowBottom = r.bottom;
                }
            }
            for (const row of rows)
                row.sort((a, b) => a.getBoundingClientRect().left - b.getBoundingClientRect().left);

            function checkGap(a: Element, b: Element, distance: number, expectedGap: number): void {
                if (distance < -TOLERANCE) {
                    violations.push({
                        type: "gap-overlap",
                        selector: selectorFor(b),
                        parentSelector: selectorFor(parent),
                        actual: Math.round(distance),
                        expected: Math.round(expectedGap),
                    });
                } else if (expectedGap > TOLERANCE && distance < expectedGap - TOLERANCE) {
                    violations.push({
                        type: "gap-missing",
                        selector: selectorFor(b),
                        parentSelector: selectorFor(parent),
                        actual: Math.round(distance),
                        expected: Math.round(expectedGap),
                    });
                } else if (expectedGap <= TOLERANCE && distance < MIN_SENSIBLE_GAP) {
                    violations.push({
                        type: "gap-flush",
                        selector: selectorFor(b),
                        parentSelector: selectorFor(parent),
                        actual: Math.round(distance),
                        expected: MIN_SENSIBLE_GAP,
                    });
                }
            }

            for (const row of rows) {
                for (let i = 0; i < row.length - 1; i++) {
                    const ra = row[i].getBoundingClientRect();
                    const rb = row[i + 1].getBoundingClientRect();
                    checkGap(row[i], row[i + 1], rb.left - ra.right, columnGap);
                }
            }

            for (let i = 0; i < rows.length - 1; i++) {
                const currentBottom = Math.max(
                    ...rows[i].map((el) => el.getBoundingClientRect().bottom),
                );
                const nextTop = Math.min(
                    ...rows[i + 1].map((el) => el.getBoundingClientRect().top),
                );
                const lowestInCurrent = rows[i].reduce((acc, el) =>
                    el.getBoundingClientRect().bottom > acc.getBoundingClientRect().bottom
                        ? el
                        : acc,
                );
                const highestInNext = rows[i + 1].reduce((acc, el) =>
                    el.getBoundingClientRect().top < acc.getBoundingClientRect().top ? el : acc,
                );
                checkGap(lowestInCurrent, highestInNext, nextTop - currentBottom, rowGap);
            }
        } else {
            const sorted = [...children].sort(
                (a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top,
            );
            for (let i = 0; i < sorted.length - 1; i++) {
                const a = sorted[i];
                const b = sorted[i + 1];
                const ra = a.getBoundingClientRect();
                const rb = b.getBoundingClientRect();
                const horizontallyOverlap = ra.left < rb.right && rb.left < ra.right;
                if (!horizontallyOverlap) continue;
                const distance = rb.top - ra.bottom;
                if (distance < -TOLERANCE) {
                    violations.push({
                        type: "block-overlap",
                        selector: selectorFor(b),
                        parentSelector: selectorFor(parent),
                        actual: Math.round(distance),
                        expected: 0,
                    });
                }
            }
        }
    }

    const STRETCH_VALUES = new Set(["stretch", "normal", "auto", ""]);
    const CONTROL_TAGS = new Set(["SELECT", "INPUT", "TEXTAREA", "BUTTON"]);
    const CONTENT_SIZED_INPUT_TYPES = new Set([
        "checkbox",
        "radio",
        "button",
        "submit",
        "reset",
        "color",
        "image",
    ]);

    for (const field of allElements) {
        if (!field.classList.contains("site-form-field")) continue;
        if (!isFlowParticipant(field)) continue;

        const control = Array.from(field.children).find(
            (child) => CONTROL_TAGS.has(child.tagName) && isFlowParticipant(child),
        );
        if (!control) continue;
        if (control.tagName === "INPUT") {
            const inputType = (control.getAttribute("type") || "text").toLowerCase();
            if (CONTENT_SIZED_INPUT_TYPES.has(inputType)) continue;
        }

        const controlStyle = getComputedStyle(control);
        if (!STRETCH_VALUES.has(controlStyle.justifySelf)) continue;

        const fieldStyle = getComputedStyle(field);
        const fieldRect = field.getBoundingClientRect();
        const paddingLeft = parseFloat(fieldStyle.paddingLeft) || 0;
        const paddingRight = parseFloat(fieldStyle.paddingRight) || 0;
        const contentWidth = fieldRect.width - paddingLeft - paddingRight;
        const controlWidth = control.getBoundingClientRect().width;
        const shrink = contentWidth - controlWidth;
        const shrinkThreshold = Math.max(16, contentWidth * 0.2);

        if (contentWidth > 0 && shrink > shrinkThreshold) {
            violations.push({
                type: "control-underfilled",
                selector: selectorFor(control),
                parentSelector: selectorFor(field),
                actual: Math.round(controlWidth),
                expected: Math.round(contentWidth),
            });
        }
    }

    function hasEllipsisAncestorException(el: Element): boolean {
        const style = getComputedStyle(el);
        if (style.textOverflow === "ellipsis") return true;
        const webkitLineClamp = style.getPropertyValue("-webkit-line-clamp");
        if (webkitLineClamp && webkitLineClamp !== "none") return true;
        return false;
    }

    for (const el of allElements) {
        if (!isFlowParticipant(el)) continue;
        const hasOwnText = Array.from(el.childNodes).some(
            (node) =>
                node.nodeType === Node.TEXT_NODE && (node.textContent || "").trim().length > 0,
        );
        if (!hasOwnText) continue;

        const style = getComputedStyle(el);
        const clipsX = style.overflowX === "hidden" || style.overflowX === "clip";
        const clipsY = style.overflowY === "hidden" || style.overflowY === "clip";
        if (!clipsX && !clipsY) continue;
        if (hasEllipsisAncestorException(el)) continue;

        const htmlEl = el as HTMLElement;
        if (clipsX && htmlEl.scrollWidth - htmlEl.clientWidth > TOLERANCE) {
            violations.push({
                type: "text-clipped",
                selector: selectorFor(el),
                parentSelector: selectorFor(el.parentElement ?? el),
                actual: htmlEl.clientWidth,
                expected: htmlEl.scrollWidth,
            });
        } else if (clipsY && htmlEl.scrollHeight - htmlEl.clientHeight > TOLERANCE) {
            violations.push({
                type: "text-clipped",
                selector: selectorFor(el),
                parentSelector: selectorFor(el.parentElement ?? el),
                actual: htmlEl.clientHeight,
                expected: htmlEl.scrollHeight,
            });
        }
    }

    return violations;
}
