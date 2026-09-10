import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const NATIVE_TAGS = new Set([
    "div",
    "span",
    "p",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "ul",
    "ol",
    "li",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
    "section",
    "article",
    "aside",
    "header",
    "footer",
    "nav",
    "form",
    "input",
    "button",
    "select",
    "textarea",
    "label",
    "a",
    "img",
    "svg",
    "dl",
    "dt",
    "dd",
    "details",
    "summary",
    "strong",
    "small",
]);

const VOID_TAGS = new Set(["input", "img"]);

const repoRoot = new URL("..", import.meta.url).pathname;

function collectRazorFiles(dir, out) {
    for (const entry of readdirSync(dir)) {
        if (entry === "bin" || entry === "obj") continue;
        const full = join(dir, entry);
        const stats = statSync(full);
        if (stats.isDirectory()) {
            collectRazorFiles(full, out);
        } else if (entry.endsWith(".razor")) {
            out.push(full);
        }
    }
    return out;
}

function stripNonMarkup(source) {
    let result = source.replace(/@\*[\s\S]*?\*@/g, (match) => " ".repeat(match.length));

    let codeStart = result.indexOf("@code");
    while (codeStart !== -1) {
        const braceStart = result.indexOf("{", codeStart);
        if (braceStart === -1) break;
        let depth = 1;
        let i = braceStart + 1;
        while (i < result.length && depth > 0) {
            if (result[i] === "{") depth++;
            else if (result[i] === "}") depth--;
            i++;
        }
        const blanked = " ".repeat(i - codeStart);
        result = result.slice(0, codeStart) + blanked + result.slice(i);
        codeStart = result.indexOf("@code", i);
    }

    result = result.replace(/@\{[\s\S]*?\}/g, (match) => " ".repeat(match.length));
    return result;
}

function shapeSignature(node) {
    return `${node.name}(${node.children.map(shapeSignature).join(",")})`;
}

function countRepeatedSiblingGroups(node, groups) {
    let run = 1;
    for (let i = 1; i <= node.children.length; i++) {
        const prevSig = i > 0 ? shapeSignature(node.children[i - 1]) : null;
        const curSig = i < node.children.length ? shapeSignature(node.children[i]) : null;
        if (curSig !== null && curSig === prevSig) {
            run++;
        } else {
            if (run >= 3) groups.push({ parent: node.name, shape: prevSig, count: run });
            run = 1;
        }
    }
    for (const child of node.children) countRepeatedSiblingGroups(child, groups);
}

function maxBranching(node, best) {
    best.value = Math.max(best.value, node.children.length);
    for (const child of node.children) maxBranching(child, best);
}

function analyzeFile(path) {
    const raw = readFileSync(path, "utf8");
    const markup = stripNonMarkup(raw);

    const tagPattern = /<(\/)?([A-Za-z][\w.:-]*)((?:[^"'>]|"[^"]*"|'[^']*')*?)(\/)?>/g;
    let weight = 0;
    let depth = 0;
    let maxDepth = 0;
    const root = { name: "#root", children: [] };
    const nativeNodeStack = [root];
    const stack = [];
    let match;

    while ((match = tagPattern.exec(markup)) !== null) {
        const [, closing, rawName, , selfClosing] = match;
        const name = rawName;
        const isComponent = /^[A-Z]/.test(name);
        const isNative = !isComponent && NATIVE_TAGS.has(name.toLowerCase());
        const isSelfClosing = Boolean(selfClosing) || VOID_TAGS.has(name.toLowerCase());

        if (closing) {
            const top = stack.pop();
            if (top === "component") {
                depth = stack.savedDepth ?? 0;
            } else if (top === "native") {
                depth = Math.max(0, depth - 1);
                if (nativeNodeStack.length > 1) nativeNodeStack.pop();
            }
            continue;
        }

        if (isComponent) {
            if (!isSelfClosing) {
                stack.push("component");
                stack.savedDepth = depth;
                depth = 0;
            }
            continue;
        }

        if (isNative) {
            weight++;
            depth++;
            maxDepth = Math.max(maxDepth, depth);
            const node = { name: name.toLowerCase(), children: [] };
            nativeNodeStack[nativeNodeStack.length - 1].children.push(node);
            if (!isSelfClosing) {
                stack.push("native");
                nativeNodeStack.push(node);
            }
        }
    }

    const repeatedGroups = [];
    countRepeatedSiblingGroups(root, repeatedGroups);
    const branching = { value: 0 };
    maxBranching(root, branching);

    return {
        weight,
        maxDepth,
        maxBranching: branching.value,
        repeatedSiblingGroups: repeatedGroups.length,
    };
}

function countFlexGridRoots(cssPath) {
    let css;
    try {
        css = readFileSync(cssPath, "utf8");
    } catch {
        return 0;
    }

    const rulePattern = /([^{}]+)\{([^{}]*)\}/g;
    const flexGridSelectors = [];
    let match;
    while ((match = rulePattern.exec(css)) !== null) {
        const [, selectorRaw, body] = match;
        if (!/display\s*:\s*(inline-)?(flex|grid)\b/.test(body)) continue;
        const selector = selectorRaw.trim();
        flexGridSelectors.push(selector);
    }

    let independentRoots = 0;
    for (const selector of flexGridSelectors) {
        const isNestedInAnother = flexGridSelectors.some((other) => {
            if (other === selector) return false;
            return selector.startsWith(other) && /^[\s>+~:.[]/.test(selector.slice(other.length));
        });
        if (!isNestedInAnother) independentRoots++;
    }
    return independentRoots;
}

const files = collectRazorFiles(repoRoot, []).filter((path) => !path.endsWith(".stories.razor"));

const results = files.map((path) => ({
    file: relative(repoRoot, path),
    ...analyzeFile(path),
    flexGridRoots: countFlexGridRoots(`${path}.css`),
}));

const mode = process.argv[2] ?? "check";

if (mode === "measure") {
    results.sort((a, b) => b.weight - a.weight);
    console.log("file\tweight\tmaxDepth\tmaxBranching\trepeatedSiblingGroups\tflexGridRoots");
    for (const result of results) {
        console.log(
            `${result.file}\t${result.weight}\t${result.maxDepth}\t${result.maxBranching}\t${result.repeatedSiblingGroups}\t${result.flexGridRoots}`,
        );
    }
    process.exit(0);
}

if (mode === "weight-report") {
    const BRANCHING_THRESHOLD = Number(process.env.COMPONENT_COMPLEXITY_BRANCHING ?? 12);

    const wideOrRepetitive = results
        .filter(
            (result) =>
                result.maxBranching > BRANCHING_THRESHOLD || result.repeatedSiblingGroups > 0,
        )
        .sort((a, b) => b.maxBranching - a.maxBranching);

    const multiLayoutRoot = results
        .filter((result) => result.flexGridRoots > 1)
        .sort((a, b) => b.flexGridRoots - a.flexGridRoots);

    console.log(
        `Wide or repetitive markup (branching>${BRANCHING_THRESHOLD} or repeated sibling groups>0): ${wideOrRepetitive.length} file(s)`,
    );
    for (const result of wideOrRepetitive) {
        console.log(
            `  ${result.file}: maxBranching=${result.maxBranching} repeatedSiblingGroups=${result.repeatedSiblingGroups}`,
        );
    }

    console.log(
        `\nMultiple independent flex/grid roots in one stylesheet: ${multiLayoutRoot.length} file(s)`,
    );
    for (const result of multiLayoutRoot) {
        console.log(`  ${result.file}: flexGridRoots=${result.flexGridRoots}`);
    }

    process.exit(0);
}

const WEIGHT_THRESHOLD = Number(process.env.COMPONENT_COMPLEXITY_WEIGHT ?? 20);
const DEPTH_THRESHOLD = Number(process.env.COMPONENT_COMPLEXITY_DEPTH ?? 6);

const violations = results.filter(
    (result) => result.weight > WEIGHT_THRESHOLD || result.maxDepth > DEPTH_THRESHOLD,
);

violations.sort((a, b) => b.weight - a.weight);

if (violations.length > 0) {
    console.log(
        `Component complexity check failed: ${violations.length} file(s) exceed weight>${WEIGHT_THRESHOLD} or depth>${DEPTH_THRESHOLD}`,
    );
    for (const violation of violations) {
        console.log(
            `  ${violation.file}: weight=${violation.weight} maxDepth=${violation.maxDepth}`,
        );
    }
    process.exit(1);
}

console.log(
    `Component complexity checks passed (${results.length} files, threshold weight<=${WEIGHT_THRESHOLD} depth<=${DEPTH_THRESHOLD})`,
);
