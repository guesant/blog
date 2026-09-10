import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const BLOCK_TAGS = new Set([
    "div",
    "section",
    "article",
    "aside",
    "header",
    "footer",
    "nav",
    "main",
    "ul",
    "ol",
    "li",
    "table",
    "thead",
    "tbody",
    "tr",
    "form",
    "fieldset",
    "p",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "SiteGrid",
    "SiteGridColumn",
    "SiteCardGrid",
    "SiteStack",
    "SiteSection",
    "SiteCard",
    "SiteCardHeader",
    "SiteCardContent",
    "SiteCardFooter",
    "SiteFormActions",
    "SiteFormField",
    "SiteFormCard",
    "SiteFilterCard",
    "SiteListingShell",
    "SitePage",
    "SiteHero",
    "SiteInline",
    "SiteSplit",
    "SiteList",
    "SiteListItem",
    "SiteTable",
    "SiteEmptyState",
    "SiteNotice",
    "SiteClickableCard",
    "SiteLiveRegion",
    "SiteStats",
    "SiteStatItem",
    "SiteToolForm",
    "SiteRelationshipItem",
    "SiteChipGroup",
    "ToolPage",
]);

const MIN_LENGTH = 0;

// Every element gets its own line: two tags never share one, whatever their name.
function isBlock(tag) {
    return BLOCK_TAGS.has(tag) || /^[A-Za-z]/.test(tag);
}

function splitLine(line) {
    const indentMatch = line.match(/^(\s*)/);
    const indent = indentMatch ? indentMatch[1] : "";
    const parts = [];
    let buffer = "";
    let depth = 0;

    for (let i = 0; i < line.length; i++) {
        buffer += line[i];
        if (line[i] !== ">") continue;

        const after = line.slice(i + 1);
        const nextTag = after.match(/^<\/?([A-Za-z][\w.]*)/);
        if (!nextTag) continue;

        const currentTag = buffer.match(/<\/?([A-Za-z][\w.]*)[^<]*>$/);
        if (!currentTag) continue;
        if (!isBlock(currentTag[1]) || !isBlock(nextTag[1])) continue;

        const closingNext = after.startsWith("</");
        const closingCurrent = buffer.trimStart().startsWith("</");
        const selfClosing = buffer.trimEnd().endsWith("/>");

        if (!closingCurrent && !selfClosing) depth++;
        else if (closingCurrent) depth = Math.max(0, depth - 1);

        const nextDepth = closingNext ? Math.max(0, depth - 1) : depth;
        parts.push({ text: buffer, depth: parts.length === 0 ? 0 : undefined });
        buffer = "";
        parts.at(-1).nextDepth = nextDepth;
    }

    if (buffer.length > 0) parts.push({ text: buffer });
    if (parts.length < 2) return null;

    const out = [];
    let level = 0;
    for (let i = 0; i < parts.length; i++) {
        const text = i === 0 ? parts[i].text : parts[i].text.trimStart();
        if (text.trimStart().startsWith("</")) level = Math.max(0, level - 1);
        out.push(i === 0 ? text : indent + "    ".repeat(level) + text);
        if (parts[i].nextDepth !== undefined) level = parts[i].nextDepth;
    }
    return out.join("\n");
}

function formatFile(path) {
    const source = readFileSync(path, "utf8");
    const lines = source.split("\n");
    let inCode = false;
    let changed = false;
    const out = [];

    for (const line of lines) {
        if (/^\s*@code\s*\{/.test(line)) inCode = true;
        if (inCode || line.length < MIN_LENGTH || !line.includes("><")) {
            out.push(line);
            continue;
        }
        const split = splitLine(line);
        if (split === null) {
            out.push(line);
            continue;
        }
        changed = true;
        out.push(split);
    }

    if (!changed) return false;
    if (process.env.FORMAT_CHECK === "1") {
        console.error(`needs formatting: ${path}`);
        return true;
    }
    writeFileSync(path, out.join("\n"));
    return true;
}

function collect(dir, out) {
    for (const entry of readdirSync(dir)) {
        if (entry === "bin" || entry === "obj" || entry === "node_modules") continue;
        const full = join(dir, entry);
        if (statSync(full).isDirectory()) collect(full, out);
        else if (entry.endsWith(".razor") && !entry.endsWith(".stories.razor")) out.push(full);
    }
    return out;
}

const files = collect(".", []);

let count = 0;
for (const file of files) {
    if (formatFile(file)) count++;
}
console.log(`razor formatting: ${count} file(s) changed of ${files.length}`);
if (process.env.FORMAT_CHECK === "1" && count > 0) process.exit(1);
