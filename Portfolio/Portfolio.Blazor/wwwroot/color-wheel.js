import {
    buildPalette,
    COLORBLIND_MATRICES,
    clamp,
    cmykToRgb,
    contrastRatio,
    hexToRgb,
    hsbToRgb,
    hslToRgb,
    isValidHex,
    isValidRgbChannel,
    labToRgb,
    normalizeHue,
    rgbToCmyk,
    rgbToHex,
    rgbToHsb,
    rgbToHsl,
    rgbToLab,
    simulateColorblindness,
} from "./color-wheel/math.js";

const WIP_KEY = "color-wheel:wip-v1";
const SAVED_KEY = "color-wheel:saved-v1";
const HISTORY_LIMIT = 50;
const WHEEL_SIZE = 260;
const WHEEL_RADIUS = WHEEL_SIZE / 2 - 14;
const CONTRAST_THRESHOLDS = { aaNormal: 4.5, aaLarge: 3, aaaNormal: 7, aaaLarge: 4.5 };

// The controller intentionally keeps all wheel state and event wiring in one closure.
// biome-ignore lint/complexity/noExcessiveLinesPerFunction: the self-contained controller owns one tool instance
document.querySelectorAll('[data-tool="color-wheel"]').forEach((root) => {
    const ruleSelect = root.querySelector("[data-color-wheel-rule]");
    const modelSelect = root.querySelector("[data-color-wheel-model]");
    const wheelWrap = root.querySelector("[data-color-wheel-wrap]");
    const canvas = root.querySelector("[data-color-wheel-canvas]");
    const linesSvg = root.querySelector("[data-color-wheel-lines]");
    const markersLayer = root.querySelector("[data-color-wheel-markers]");
    const brightnessInput = root.querySelector("[data-color-wheel-brightness]");
    const hexInput = root.querySelector("[data-color-wheel-hex-input]");
    const hexError = root.querySelector("[data-color-wheel-hex-error]");
    const channelsEl = root.querySelector("[data-color-wheel-channels]");
    const channelError = root.querySelector("[data-color-wheel-channel-error]");
    const paletteGrid = root.querySelector("[data-color-wheel-palette]");
    const randomBtn = root.querySelector("[data-color-wheel-random]");
    const undoBtn = root.querySelector("[data-color-wheel-undo]");
    const redoBtn = root.querySelector("[data-color-wheel-redo]");
    const extractFile = root.querySelector("[data-color-wheel-extract-file]");
    const extractCount = root.querySelector("[data-color-wheel-extract-count]");
    const contrastList = root.querySelector("[data-color-wheel-contrast]");
    const colorblindGrid = root.querySelector("[data-color-wheel-colorblind]");
    const saveNameInput = root.querySelector("[data-color-wheel-save-name]");
    const saveTagsInput = root.querySelector("[data-color-wheel-save-tags]");
    const saveBtn = root.querySelector("[data-color-wheel-save-btn]");
    const savedSearch = root.querySelector("[data-color-wheel-search]");
    const savedList = root.querySelector("[data-color-wheel-saved-list]");
    const savedEmpty = root.querySelector("[data-color-wheel-saved-empty]");
    const exportJsonBtn = root.querySelector("[data-color-wheel-export-json]");
    const exportCssBtn = root.querySelector("[data-color-wheel-export-css]");
    const exportPngBtn = root.querySelector("[data-color-wheel-export-png]");

    if (!ruleSelect || !modelSelect || !wheelWrap || !canvas || !markersLayer || !paletteGrid) {
        return;
    }

    const ctx = canvas.getContext("2d");

    const state = {
        rule: "complementary",
        base: { h: 0, s: 0, b: 0 },
        palette: [],
        locks: [],
        selected: 0,
        history: [],
        future: [],
    };

    let markerEls = [];
    let dragIndex = null;
    let extractedImage = null;

    function entryRgb(entry) {
        return hsbToRgb(entry.h, entry.s, entry.b);
    }

    function entryHex(entry) {
        return rgbToHex(entryRgb(entry));
    }

    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: pixel rendering combines the wheel's bounds and color conversion
    function drawWheelBase() {
        canvas.width = WHEEL_SIZE;
        canvas.height = WHEEL_SIZE;
        const image = ctx.createImageData(WHEEL_SIZE, WHEEL_SIZE);
        const cx = WHEEL_SIZE / 2;
        const cy = WHEEL_SIZE / 2;

        for (let y = 0; y < WHEEL_SIZE; y += 1) {
            for (let x = 0; x < WHEEL_SIZE; x += 1) {
                const dx = x - cx;
                const dy = y - cy;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const offset = (y * WHEEL_SIZE + x) * 4;

                if (dist > WHEEL_RADIUS) {
                    image.data[offset + 3] = 0;
                    continue;
                }

                const hue = normalizeHue((Math.atan2(dy, dx) * 180) / Math.PI);
                const sat = clamp((dist / WHEEL_RADIUS) * 100, 0, 100);
                const rgb = hsbToRgb(hue, sat, 100);
                image.data[offset] = rgb.r;
                image.data[offset + 1] = rgb.g;
                image.data[offset + 2] = rgb.b;
                image.data[offset + 3] = 255;
            }
        }

        ctx.putImageData(image, 0, 0);
    }

    function polarFromHueSat(h, s) {
        const cx = WHEEL_SIZE / 2;
        const cy = WHEEL_SIZE / 2;
        const angleRad = (normalizeHue(h) * Math.PI) / 180;
        const dist = (clamp(s, 0, 100) / 100) * WHEEL_RADIUS;
        return { x: cx + dist * Math.cos(angleRad), y: cy + dist * Math.sin(angleRad) };
    }

    function hueSatFromPoint(clientX, clientY) {
        const rect = wheelWrap.getBoundingClientRect();
        const scale = WHEEL_SIZE / rect.width;
        const cx = WHEEL_SIZE / 2;
        const cy = WHEEL_SIZE / 2;
        const dx = (clientX - rect.left) * scale - cx;
        const dy = (clientY - rect.top) * scale - cy;
        const dist = Math.min(Math.sqrt(dx * dx + dy * dy), WHEEL_RADIUS);
        const hue = normalizeHue((Math.atan2(dy, dx) * 180) / Math.PI);
        const sat = clamp((dist / WHEEL_RADIUS) * 100, 0, 100);
        return { h: hue, s: sat };
    }

    function defaultBase() {
        return rgbToHsb(hexToRgb("#4f46e5"));
    }

    function applyRule(rule, { fromCustomPreserve = true } = {}) {
        state.rule = rule;
        let generated;

        if (rule === "custom") {
            generated =
                fromCustomPreserve && state.palette.length
                    ? state.palette.map((entry) => ({
                          ...entry,
                          kind: "primary",
                          offset: 0,
                          sDelta: 0,
                      }))
                    : buildPalette("square", state.base);
        } else {
            generated = buildPalette(rule, state.base);
        }

        const next = generated.map((entry, i) => {
            if (state.locks[i] && state.palette[i]) {
                return { ...state.palette[i] };
            }
            return { ...entry };
        });

        state.palette = next;
        state.locks = next.map((_, i) => Boolean(state.locks[i]));
        state.selected = Math.min(state.selected, state.palette.length - 1);
    }

    function recomputeFromMarker(index, newHue, newSat) {
        if (state.locks[index]) {
            return;
        }
        const entry = state.palette[index];

        if (state.rule === "custom") {
            entry.h = normalizeHue(newHue);
            entry.s = clamp(newSat, 0, 100);
            return;
        }

        const newBaseH = normalizeHue(newHue - entry.offset);
        const newBaseS = clamp(newSat - entry.sDelta, 0, 100);
        state.base = { h: newBaseH, s: newBaseS, b: state.base.b };

        const generated = buildPalette(state.rule, state.base);
        generated.forEach((g, i) => {
            if (state.locks[i] || !state.palette[i]) {
                return;
            }
            state.palette[i].h = g.h;
            state.palette[i].s = g.s;
            state.palette[i].offset = g.offset;
            state.palette[i].sDelta = g.sDelta;
            state.palette[i].kind = g.kind;
        });
    }

    function applySwatchColor(index, rgb, { commit = true } = {}) {
        if (state.locks[index]) {
            return;
        }
        const hsb = rgbToHsb(rgb);
        recomputeFromMarker(index, hsb.h, hsb.s);
        state.palette[index].b = hsb.b;
        renderFull();
        if (commit) {
            pushHistory();
        }
    }

    function pushHistory() {
        const snapshot = JSON.stringify({
            rule: state.rule,
            base: state.base,
            palette: state.palette,
            locks: state.locks,
            selected: state.selected,
        });
        state.history.push(snapshot);
        if (state.history.length > HISTORY_LIMIT) {
            state.history.shift();
        }
        state.future = [];
        try {
            localStorage.setItem(WIP_KEY, snapshot);
        } catch {
            /* noop */
        }
        updateUndoRedoButtons();
    }

    function restoreSnapshot(json) {
        const snap = JSON.parse(json);
        state.rule = snap.rule;
        state.base = snap.base;
        state.palette = snap.palette;
        state.locks = snap.locks;
        state.selected = snap.selected;
    }

    function undo() {
        if (state.history.length <= 1) {
            return;
        }
        const last = state.history.pop();
        state.future.push(last);
        restoreSnapshot(state.history[state.history.length - 1]);
        ruleSelect.value = state.rule;
        renderFull();
        updateUndoRedoButtons();
    }

    function redo() {
        if (!state.future.length) {
            return;
        }
        const snap = state.future.pop();
        state.history.push(snap);
        restoreSnapshot(snap);
        ruleSelect.value = state.rule;
        renderFull();
        updateUndoRedoButtons();
    }

    function updateUndoRedoButtons() {
        if (undoBtn) {
            undoBtn.disabled = state.history.length <= 1;
        }
        if (redoBtn) {
            redoBtn.disabled = state.future.length === 0;
        }
    }

    function buildMarkerEls() {
        markersLayer.innerHTML = "";
        markerEls = state.palette.map((_entry, i) => {
            const marker = document.createElement("button");
            marker.type = "button";
            marker.className = "tool-wheel-marker";
            marker.dataset.index = String(i);
            marker.setAttribute(
                "aria-label",
                `${markersLayer.dataset.markerLabel || "color marker"} ${i + 1}`,
            );

            marker.addEventListener("pointerdown", (event) => onMarkerPointerDown(event, i));
            marker.addEventListener("keydown", (event) => onMarkerKeyDown(event, i));
            marker.addEventListener("focus", () => selectSwatch(i, { render: true }));

            markersLayer.append(marker);
            return marker;
        });
    }

    function renderMarkers() {
        state.palette.forEach((entry, i) => {
            const marker = markerEls[i];
            if (!marker) {
                return;
            }
            const { x, y } = polarFromHueSat(entry.h, entry.s);
            marker.style.left = `${x}px`;
            marker.style.top = `${y}px`;
            marker.style.backgroundColor = entryHex(entry);
            marker.classList.toggle("tool-wheel-marker--selected", i === state.selected);
            marker.classList.toggle("tool-wheel-marker--locked", Boolean(state.locks[i]));
            marker.setAttribute("aria-pressed", i === state.selected ? "true" : "false");
        });
        renderLines();
    }

    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: geometry rendering handles the rule-specific overlays
    function renderLines() {
        if (!linesSvg) {
            return;
        }
        linesSvg.innerHTML = "";
        if (state.rule === "custom" || state.rule === "monochromatic" || state.rule === "shades") {
            return;
        }

        const primaryIndices = state.palette
            .map((entry, i) => (entry.kind === "primary" ? i : -1))
            .filter((i) => i !== -1);

        if (primaryIndices.length < 2) {
            return;
        }

        const points = primaryIndices.map((i) =>
            polarFromHueSat(state.palette[i].h, state.palette[i].s),
        );
        const path = points.map((p) => `${p.x},${p.y}`).join(" ");
        const tag = points.length > 2 ? "polygon" : "polyline";
        const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
        el.setAttribute("points", path);
        el.setAttribute("class", "tool-wheel-geometry");
        linesSvg.append(el);
    }

    function selectSwatch(index, { render = false } = {}) {
        state.selected = clamp(index, 0, state.palette.length - 1);
        if (render) {
            renderFull();
        }
    }

    function renderPaletteGrid() {
        paletteGrid.innerHTML = "";
        // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: each swatch owns selection, lock, and copy actions
        state.palette.forEach((entry, i) => {
            const card = document.createElement("div");
            card.className = "tool-swatch-card";
            card.classList.toggle("tool-swatch-card--selected", i === state.selected);

            const swatchBtn = document.createElement("button");
            swatchBtn.type = "button";
            swatchBtn.className = "tool-swatch-chip";
            swatchBtn.style.backgroundColor = entryHex(entry);
            swatchBtn.setAttribute(
                "aria-label",
                `${paletteGrid.dataset.selectLabel || "select"} ${entryHex(entry)}`,
            );
            swatchBtn.addEventListener("click", () => selectSwatch(i, { render: true }));

            const hexLabel = document.createElement("span");
            hexLabel.className = "tool-swatch-hex";
            hexLabel.textContent = entryHex(entry);

            const actions = document.createElement("div");
            actions.className = "tool-swatch-actions";

            const lockBtn = document.createElement("button");
            lockBtn.type = "button";
            lockBtn.className = "tool-action-btn";
            lockBtn.setAttribute("aria-pressed", state.locks[i] ? "true" : "false");
            lockBtn.textContent = state.locks[i]
                ? paletteGrid.dataset.lockedLabel || "locked"
                : paletteGrid.dataset.lockLabel || "lock";
            lockBtn.addEventListener("click", () => {
                state.locks[i] = !state.locks[i];
                renderFull();
                pushHistory();
            });

            const copyHexBtn = document.createElement("button");
            copyHexBtn.type = "button";
            copyHexBtn.className = "tool-action-btn";
            copyHexBtn.textContent = paletteGrid.dataset.copyHexLabel || "hex";
            copyHexBtn.addEventListener("click", () => copyValue(entryHex(entry), copyHexBtn));

            const copyRgbBtn = document.createElement("button");
            copyRgbBtn.type = "button";
            copyRgbBtn.className = "tool-action-btn";
            copyRgbBtn.textContent = paletteGrid.dataset.copyRgbLabel || "rgb";
            copyRgbBtn.addEventListener("click", () => {
                const rgb = entryRgb(entry);
                copyValue(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, copyRgbBtn);
            });

            actions.append(lockBtn, copyHexBtn, copyRgbBtn);
            card.append(swatchBtn, hexLabel, actions);
            paletteGrid.append(card);
        });
    }

    let copyResetTimeout;
    function copyValue(text, buttonElement) {
        const button = buttonElement;
        navigator.clipboard
            .writeText(text)
            .then(() => {
                const original = button.textContent;
                button.textContent = paletteGrid.dataset.copiedLabel || "copied";
                clearTimeout(copyResetTimeout);
                copyResetTimeout = setTimeout(() => {
                    button.textContent = original;
                }, 1500);
            })
            .catch(() => {});
    }

    function renderSelectedControls() {
        const entry = state.palette[state.selected];
        if (!entry) {
            return;
        }
        const rgb = entryRgb(entry);
        const hex = rgbToHex(rgb);

        if (hexInput) {
            hexInput.value = hex;
        }
        if (brightnessInput) {
            brightnessInput.value = String(entry.b);
        }
        if (hexError) {
            hexError.hidden = true;
        }

        renderChannels(entry, rgb);
    }

    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: channel controls share validation and conversion wiring
    function renderChannels(entry, rgb) {
        if (!channelsEl) {
            return;
        }
        channelsEl.innerHTML = "";
        if (channelError) {
            channelError.hidden = true;
        }
        const model = modelSelect.value;

        let fields = [];
        if (model === "rgb") {
            fields = [
                { key: "r", label: "R", value: rgb.r, min: 0, max: 255 },
                { key: "g", label: "G", value: rgb.g, min: 0, max: 255 },
                { key: "b", label: "B", value: rgb.b, min: 0, max: 255 },
            ];
        } else if (model === "hsb") {
            fields = [
                { key: "h", label: "H", value: entry.h, min: 0, max: 360 },
                { key: "s", label: "S", value: entry.s, min: 0, max: 100 },
                { key: "v", label: "B", value: entry.b, min: 0, max: 100 },
            ];
        } else if (model === "hsl") {
            const hsl = rgbToHsl(rgb);
            fields = [
                { key: "h", label: "H", value: hsl.h, min: 0, max: 360 },
                { key: "s", label: "S", value: hsl.s, min: 0, max: 100 },
                { key: "l", label: "L", value: hsl.l, min: 0, max: 100 },
            ];
        } else {
            const cmyk = rgbToCmyk(rgb);
            fields = [
                { key: "c", label: "C", value: cmyk.c, min: 0, max: 100, step: 1 },
                { key: "m", label: "M", value: cmyk.m, min: 0, max: 100, step: 1 },
                { key: "y", label: "Y", value: cmyk.y, min: 0, max: 100, step: 1 },
                { key: "k", label: "K", value: cmyk.k, min: 0, max: 100, step: 1 },
            ];
        }

        if (model === "lab") {
            const lab = rgbToLab(rgb);
            fields = [
                { key: "l", label: "L*", value: lab.l, min: 0, max: 100, step: 0.1 },
                { key: "a", label: "a*", value: lab.a, min: -128, max: 127, step: 0.1 },
                { key: "b", label: "b*", value: lab.b, min: -128, max: 127, step: 0.1 },
            ];
        }

        fields.forEach((field) => {
            const row = document.createElement("label");
            row.className = "tool-channel-row";

            const labelText = document.createElement("span");
            labelText.textContent = field.label;

            const range = document.createElement("input");
            range.type = "range";
            range.className = "tool-range";
            range.min = String(field.min);
            range.max = String(field.max);
            range.step = String(field.step || 1);
            range.value = String(field.value);

            const number = document.createElement("input");
            number.type = "number";
            number.min = String(field.min);
            number.max = String(field.max);
            number.step = String(field.step || 1);
            number.value = String(field.value);

            function commitChannel(value, commit) {
                const nextRgb = channelsToRgb(model, field.key, value, rgb, entry);
                if (!nextRgb) {
                    return;
                }
                applySwatchColor(state.selected, nextRgb, { commit });
            }

            range.addEventListener("input", () => {
                number.value = range.value;
                commitChannel(Number(range.value), false);
            });
            range.addEventListener("change", () => commitChannel(Number(range.value), true));
            // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: the field handler validates and commits one channel atomically
            number.addEventListener("change", () => {
                const raw = Number(number.value);
                const isRgbChannel = model === "rgb";
                const invalid = isRgbChannel
                    ? !isValidRgbChannel(raw)
                    : !Number.isFinite(raw) || raw < field.min || raw > field.max;

                if (invalid) {
                    if (channelError) {
                        channelError.hidden = false;
                        channelError.textContent =
                            channelError.dataset.invalidLabel || "invalid value";
                    }
                    number.value = String(field.value);
                    range.value = String(field.value);
                    return;
                }

                if (channelError) {
                    channelError.hidden = true;
                }
                range.value = String(raw);
                commitChannel(raw, true);
            });

            row.append(labelText, range, number);
            channelsEl.append(row);
        });
    }

    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: conversion dispatch is kept beside the channel editor
    function channelsToRgb(model, key, value, currentRgb, entry) {
        if (model === "rgb") {
            return { ...currentRgb, [key]: clamp(Math.round(value), 0, 255) };
        }
        if (model === "hsb") {
            const h = key === "h" ? value : entry.h;
            const s = key === "s" ? value : entry.s;
            const v = key === "v" ? value : entry.b;
            return hsbToRgb(h, s, v);
        }
        if (model === "hsl") {
            const hsl = rgbToHsl(currentRgb);
            const h = key === "h" ? value : hsl.h;
            const s = key === "s" ? value : hsl.s;
            const l = key === "l" ? value : hsl.l;
            return hslToRgb(h, s, l);
        }
        if (model === "lab") {
            const lab = rgbToLab(currentRgb);
            return labToRgb({ ...lab, [key]: value });
        }
        const cmyk = rgbToCmyk(currentRgb);
        return cmykToRgb({ ...cmyk, [key]: value });
    }

    function renderContrastList() {
        if (!contrastList) {
            return;
        }
        contrastList.innerHTML = "";

        for (let i = 0; i < state.palette.length; i += 1) {
            for (let j = i + 1; j < state.palette.length; j += 1) {
                const rgbA = entryRgb(state.palette[i]);
                const rgbB = entryRgb(state.palette[j]);
                const ratio = contrastRatio(rgbA, rgbB);

                const item = document.createElement("li");
                item.className =
                    "list-group-item d-flex flex-wrap justify-content-between align-items-start gap-3 tool-list-item tool-contrast-item";

                const swatchPair = document.createElement("span");
                swatchPair.className = "tool-contrast-pair";
                const chipA = document.createElement("span");
                chipA.className = "tool-contrast-chip";
                chipA.style.backgroundColor = rgbToHex(rgbA);
                const chipB = document.createElement("span");
                chipB.className = "tool-contrast-chip";
                chipB.style.backgroundColor = rgbToHex(rgbB);
                swatchPair.append(chipA, chipB);

                const ratioText = document.createElement("span");
                ratioText.className = "tool-list-value";
                ratioText.textContent = `${ratio.toFixed(2)}:1`;

                const badges = document.createElement("span");
                badges.className = "tool-badge-list";
                [
                    ["aa_normal", "AA", CONTRAST_THRESHOLDS.aaNormal],
                    ["aa_large", "AA lg", CONTRAST_THRESHOLDS.aaLarge],
                    ["aaa_normal", "AAA", CONTRAST_THRESHOLDS.aaaNormal],
                    ["aaa_large", "AAA lg", CONTRAST_THRESHOLDS.aaaLarge],
                ] // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: each accessibility badge derives its own threshold state
                    .forEach(([, name, threshold]) => {
                        const passes = ratio >= threshold;
                        const badge = document.createElement("span");
                        badge.className = `tool-badge ${passes ? "tool-badge--pass" : "tool-badge--fail"}`;
                        const status = passes
                            ? contrastList.dataset.passLabel || "pass"
                            : contrastList.dataset.failLabel || "fail";
                        badge.textContent = `${name}: ${status}`;
                        badges.append(badge);
                    });

                item.append(swatchPair, ratioText, badges);
                contrastList.append(item);
            }
        }
    }

    function renderColorblindPreview() {
        if (!colorblindGrid) {
            return;
        }
        colorblindGrid.innerHTML = "";

        Object.entries(COLORBLIND_MATRICES).forEach(([key, matrix]) => {
            const figure = document.createElement("figure");
            figure.className = "tool-simulation-item";

            const strip = document.createElement("div");
            strip.className = "tool-colorblind-strip";
            state.palette.forEach((entry) => {
                const simulated = simulateColorblindness(entryRgb(entry), matrix);
                const chip = document.createElement("span");
                chip.className = "tool-contrast-chip";
                chip.style.backgroundColor = rgbToHex(simulated);
                strip.append(chip);
            });

            const caption = document.createElement("figcaption");
            caption.textContent = colorblindGrid.dataset[`${key}Label`] || key;

            figure.append(strip, caption);
            colorblindGrid.append(figure);
        });
    }

    function renderFull() {
        if (markerEls.length !== state.palette.length) {
            buildMarkerEls();
        }
        renderMarkers();
        renderPaletteGrid();
        renderSelectedControls();
        renderContrastList();
        renderColorblindPreview();
    }

    function onMarkerPointerDown(event, index) {
        event.stopPropagation();
        selectSwatch(index);
        if (state.locks[index]) {
            return;
        }
        dragIndex = index;
        event.target.setPointerCapture(event.pointerId);
    }

    function onWheelPointerDown(event) {
        if (event.target !== canvas && event.target !== wheelWrap) {
            return;
        }
        if (state.locks[state.selected]) {
            return;
        }
        dragIndex = state.selected;
        const { h, s } = hueSatFromPoint(event.clientX, event.clientY);
        recomputeFromMarker(dragIndex, h, s);
        renderMarkers();
        wheelWrap.setPointerCapture(event.pointerId);
    }

    function onWheelPointerMove(event) {
        if (dragIndex === null) {
            return;
        }
        const { h, s } = hueSatFromPoint(event.clientX, event.clientY);
        recomputeFromMarker(dragIndex, h, s);
        renderMarkers();
    }

    function onWheelPointerUp() {
        if (dragIndex === null) {
            return;
        }
        dragIndex = null;
        renderFull();
        pushHistory();
    }

    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: arrow-key movement maps directly to the four wheel directions
    function onMarkerKeyDown(event, index) {
        const step = event.shiftKey ? 10 : 1;
        const entry = state.palette[index];
        if (!entry) {
            return;
        }
        let handled = true;

        if (event.key === "ArrowLeft") {
            recomputeFromMarker(index, entry.h - step, entry.s);
        } else if (event.key === "ArrowRight") {
            recomputeFromMarker(index, entry.h + step, entry.s);
        } else if (event.key === "ArrowUp") {
            recomputeFromMarker(index, entry.h, entry.s + step);
        } else if (event.key === "ArrowDown") {
            recomputeFromMarker(index, entry.h, entry.s - step);
        } else {
            handled = false;
        }

        if (!handled) {
            return;
        }
        event.preventDefault();
        renderFull();
        pushHistory();
    }

    wheelWrap.addEventListener("pointerdown", onWheelPointerDown);
    wheelWrap.addEventListener("pointermove", onWheelPointerMove);
    wheelWrap.addEventListener("pointerup", onWheelPointerUp);
    wheelWrap.addEventListener("pointercancel", onWheelPointerUp);

    ruleSelect.addEventListener("change", () => {
        applyRule(ruleSelect.value);
        renderFull();
        pushHistory();
    });

    modelSelect.addEventListener("change", () => renderSelectedControls());

    brightnessInput?.addEventListener("input", () => {
        if (state.locks[state.selected]) {
            return;
        }
        state.palette[state.selected].b = clamp(Number(brightnessInput.value), 0, 100);
        renderMarkers();
        renderPaletteGrid();
    });
    brightnessInput?.addEventListener("change", () => {
        renderFull();
        pushHistory();
    });

    hexInput?.addEventListener("change", () => {
        const value = hexInput.value.trim();
        if (!isValidHex(value)) {
            if (hexError) {
                hexError.hidden = false;
                hexError.textContent = hexError.dataset.invalidLabel || "invalid";
            }
            hexInput.value = entryHex(state.palette[state.selected]);
            return;
        }
        if (hexError) {
            hexError.hidden = true;
        }
        applySwatchColor(state.selected, hexToRgb(value));
    });

    randomBtn?.addEventListener("click", () => {
        const randomHue = Math.floor(Math.random() * 360);
        const randomSat = 40 + Math.floor(Math.random() * 60);
        const randomBri = 55 + Math.floor(Math.random() * 45);

        if (state.rule === "custom") {
            state.palette.forEach((entry, i) => {
                if (state.locks[i]) {
                    return;
                }
                state.palette[i] = {
                    ...entry,
                    h: Math.floor(Math.random() * 360),
                    s: 40 + Math.floor(Math.random() * 60),
                    b: 55 + Math.floor(Math.random() * 45),
                };
            });
        } else {
            state.base = { h: randomHue, s: randomSat, b: randomBri };
            const generated = buildPalette(state.rule, state.base);
            generated.forEach((g, i) => {
                if (state.locks[i] || !state.palette[i]) {
                    return;
                }
                state.palette[i] = { ...g };
            });
        }

        renderFull();
        pushHistory();
    });

    undoBtn?.addEventListener("click", undo);
    redoBtn?.addEventListener("click", redo);

    extractFile?.addEventListener("change", () => {
        const file = extractFile.files?.[0];
        if (!file) {
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.onload = () => {
                extractedImage = img;
                runExtraction();
            };
            img.src = String(reader.result);
        };
        reader.readAsDataURL(file);
    });

    extractCount?.addEventListener("change", () => {
        if (extractedImage) {
            runExtraction();
        }
    });

    function runExtraction() {
        if (!extractedImage) {
            return;
        }
        const count = clamp(Number(extractCount?.value) || 5, 4, 8);
        const colors = extractPaletteFromImage(extractedImage, count);
        if (!colors.length) {
            return;
        }

        state.rule = "custom";
        ruleSelect.value = "custom";
        state.palette = colors.map((rgb) => {
            const hsb = rgbToHsb(rgb);
            return { h: hsb.h, s: hsb.s, b: hsb.b, kind: "primary", offset: 0, sDelta: 0 };
        });
        state.locks = state.palette.map(() => false);
        state.selected = 0;
        markerEls = [];
        renderFull();
        pushHistory();
    }

    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: local image quantization handles sampling and bucket accumulation
    function extractPaletteFromImage(img, count) {
        const maxDim = 120;
        const scale = Math.min(1, maxDim / Math.max(img.naturalWidth, img.naturalHeight, 1));
        const sampleCanvas = document.createElement("canvas");
        sampleCanvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
        sampleCanvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
        const sampleCtx = sampleCanvas.getContext("2d");
        sampleCtx.drawImage(img, 0, 0, sampleCanvas.width, sampleCanvas.height);
        const { data } = sampleCtx.getImageData(0, 0, sampleCanvas.width, sampleCanvas.height);

        const buckets = new Map();
        for (let i = 0; i < data.length; i += 4) {
            if (data[i + 3] < 128) {
                continue;
            }
            const key = ((data[i] >> 4) << 8) | ((data[i + 1] >> 4) << 4) | (data[i + 2] >> 4);
            const bucket = buckets.get(key);
            if (bucket) {
                bucket.count += 1;
                bucket.r += data[i];
                bucket.g += data[i + 1];
                bucket.b += data[i + 2];
            } else {
                buckets.set(key, { count: 1, r: data[i], g: data[i + 1], b: data[i + 2] });
            }
        }

        return Array.from(buckets.values())
            .sort((a, b) => b.count - a.count)
            .slice(0, count)
            .map((bucket) => ({
                r: Math.round(bucket.r / bucket.count),
                g: Math.round(bucket.g / bucket.count),
                b: Math.round(bucket.b / bucket.count),
            }));
    }

    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: saving assembles the complete portable local record
    saveBtn?.addEventListener("click", () => {
        const name = saveNameInput?.value.trim();
        if (!name) {
            return;
        }
        const tags = (saveTagsInput?.value || "")
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean);

        const record = {
            id: crypto.randomUUID
                ? crypto.randomUUID()
                : `pal-${Date.now()}-${Math.random().toString(16).slice(2)}`,
            name,
            tags,
            rule: state.rule,
            colors: state.palette.map((entry) => ({ h: entry.h, s: entry.s, b: entry.b })),
            createdAt: Date.now(),
        };

        const saved = readSavedPalettes();
        saved.push(record);
        writeSavedPalettes(saved);
        if (saveNameInput) {
            saveNameInput.value = "";
        }
        if (saveTagsInput) {
            saveTagsInput.value = "";
        }
        renderSavedList();
    });

    savedSearch?.addEventListener("input", () => renderSavedList());

    function readSavedPalettes() {
        try {
            const raw = localStorage.getItem(SAVED_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    }

    function writeSavedPalettes(list) {
        try {
            localStorage.setItem(SAVED_KEY, JSON.stringify(list));
        } catch {
            /* noop */
        }
    }

    function renderSavedList() {
        if (!savedList) {
            return;
        }
        const query = (savedSearch?.value || "").trim().toLowerCase();
        const saved = readSavedPalettes().filter((record) => {
            if (!query) {
                return true;
            }
            const haystack = `${record.name} ${record.tags.join(" ")}`.toLowerCase();
            return haystack.includes(query);
        });

        savedList.innerHTML = "";
        if (savedEmpty) {
            savedEmpty.hidden = saved.length > 0;
        }

        saved
            .slice()
            .sort((a, b) => b.createdAt - a.createdAt)
            .forEach((record) => {
                const item = document.createElement("li");
                item.className =
                    "list-group-item d-flex flex-wrap justify-content-between align-items-start gap-3 tool-list-item tool-saved-item";

                const info = document.createElement("button");
                info.type = "button";
                info.className = "tool-saved-load";
                const strip = document.createElement("span");
                strip.className = "tool-colorblind-strip";
                record.colors.forEach((color) => {
                    const chip = document.createElement("span");
                    chip.className = "tool-contrast-chip";
                    chip.style.backgroundColor = rgbToHex(hsbToRgb(color.h, color.s, color.b));
                    strip.append(chip);
                });
                const label = document.createElement("span");
                label.className = "tool-list-value";
                label.textContent = record.tags.length
                    ? `${record.name} (${record.tags.join(", ")})`
                    : record.name;
                info.append(strip, label);
                info.addEventListener("click", () => loadSavedPalette(record));

                const deleteBtn = document.createElement("button");
                deleteBtn.type = "button";
                deleteBtn.className = "tool-action-btn";
                deleteBtn.textContent = savedList.dataset.deleteLabel || "delete";
                deleteBtn.addEventListener("click", () => {
                    writeSavedPalettes(readSavedPalettes().filter((r) => r.id !== record.id));
                    renderSavedList();
                });

                item.append(info, deleteBtn);
                savedList.append(item);
            });
    }

    function loadSavedPalette(record) {
        state.rule = "custom";
        ruleSelect.value = "custom";
        state.palette = record.colors.map((color) => ({
            h: color.h,
            s: color.s,
            b: color.b,
            kind: "primary",
            offset: 0,
            sDelta: 0,
        }));
        state.locks = state.palette.map(() => false);
        state.selected = 0;
        markerEls = [];
        renderFull();
        pushHistory();
    }

    function triggerDownload(blob, filename) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.append(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    }

    exportJsonBtn?.addEventListener("click", () => {
        const payload = {
            rule: state.rule,
            colors: state.palette.map((entry) => {
                const rgb = entryRgb(entry);
                return { hex: rgbToHex(rgb), rgb, hsb: { h: entry.h, s: entry.s, b: entry.b } };
            }),
        };
        triggerDownload(
            new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }),
            "color-wheel-palette.json",
        );
    });

    exportCssBtn?.addEventListener("click", () => {
        const lines = [":root {"];
        state.palette.forEach((entry, i) => {
            lines.push(`  --color-${i + 1}: ${entryHex(entry)};`);
        });
        lines.push("}");
        triggerDownload(
            new Blob([lines.join("\n")], { type: "text/css" }),
            "color-wheel-palette.css",
        );
    });

    exportPngBtn?.addEventListener("click", () => {
        const swatchWidth = 140;
        const swatchHeight = 160;
        const exportCanvas = document.createElement("canvas");
        exportCanvas.width = swatchWidth * state.palette.length;
        exportCanvas.height = swatchHeight;
        const exportCtx = exportCanvas.getContext("2d");

        state.palette.forEach((entry, i) => {
            const rgb = entryRgb(entry);
            const hex = rgbToHex(rgb);
            exportCtx.fillStyle = hex;
            exportCtx.fillRect(i * swatchWidth, 0, swatchWidth, swatchHeight - 30);
            exportCtx.fillStyle = "#111111";
            exportCtx.fillRect(i * swatchWidth, swatchHeight - 30, swatchWidth, 30);
            exportCtx.fillStyle = "#ffffff";
            exportCtx.font = "14px monospace";
            exportCtx.fillText(hex, i * swatchWidth + 10, swatchHeight - 10);
        });

        exportCanvas.toBlob((blob) => {
            if (!blob) {
                return;
            }
            triggerDownload(blob, "color-wheel-palette.png");
        }, "image/png");
    });

    function init() {
        drawWheelBase();

        let restored = false;
        try {
            const raw = localStorage.getItem(WIP_KEY);
            if (raw) {
                restoreSnapshot(raw);
                restored = true;
            }
        } catch {
            /* noop */
        }

        if (!restored) {
            state.base = defaultBase();
            applyRule("complementary", { fromCustomPreserve: false });
        }

        ruleSelect.value = state.rule;
        state.history = [
            JSON.stringify({
                rule: state.rule,
                base: state.base,
                palette: state.palette,
                locks: state.locks,
                selected: state.selected,
            }),
        ];
        markerEls = [];
        renderFull();
        renderSavedList();
        updateUndoRedoButtons();
    }

    init();
});
