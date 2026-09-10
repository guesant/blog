import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const MAX_LENGTH = 100;

function readValue(line, start) {
    const quote = line[start];
    if (quote !== '"' && quote !== "'") {
        let i = start;
        while (i < line.length && !/[\s>]/.test(line[i])) i++;
        return i;
    }
    let depth = 0;
    for (let i = start + 1; i < line.length; i++) {
        const ch = line[i];
        if (ch === "\\") {
            i++;
            continue;
        }
        if (ch === "(" || ch === "[" || ch === "{") depth++;
        else if (ch === ")" || ch === "]" || ch === "}") depth--;
        else if (ch === quote && depth === 0) return i + 1;
    }
    return -1;
}

function parseTag(line) {
    const open = line.search(/<[A-Za-z]/);
    if (open === -1) return null;
    const nameMatch = line.slice(open + 1).match(/^([A-Za-z][\w.:-]*)/);
    if (!nameMatch) return null;

    const attributes = [];
    let i = open + 1 + nameMatch[0].length;
    while (i < line.length) {
        while (i < line.length && /\s/.test(line[i])) i++;
        if (i >= line.length) return null;
        if (line[i] === ">")
            return { open, name: nameMatch[0], attributes, end: i, selfClosing: false };
        if (line[i] === "/" && line[i + 1] === ">") {
            return { open, name: nameMatch[0], attributes, end: i + 1, selfClosing: true };
        }
        const start = i;
        while (i < line.length && !/[\s=>]/.test(line[i])) i++;
        if (line[i] === "=") {
            const valueEnd = readValue(line, i + 1);
            if (valueEnd === -1) return null;
            i = valueEnd;
        }
        attributes.push(line.slice(start, i));
    }
    return null;
}

function splitAttributes(line) {
    if (line.length <= MAX_LENGTH) return null;
    const tag = parseTag(line);
    if (tag === null || tag.attributes.length < 2) return null;

    const indent = line.match(/^(\s*)/)[1];
    const continuation = indent + "    ";
    const head = `${line.slice(0, tag.open)}<${tag.name} ${tag.attributes[0]}`;
    const rest = tag.attributes.slice(1).map((attribute) => continuation + attribute);
    rest[rest.length - 1] += tag.selfClosing ? " />" : ">";
    return [head, ...rest].join("\n") + line.slice(tag.end + 1);
}

function formatFile(path) {
    const source = readFileSync(path, "utf8");
    const lines = source.split("\n");
    const out = [];
    let inCode = false;
    let changed = false;

    for (const line of lines) {
        if (/^\s*@code\s*\{/.test(line)) inCode = true;
        if (inCode || line.length <= MAX_LENGTH) {
            out.push(line);
            continue;
        }
        const split = splitAttributes(line);
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
        else if (entry.endsWith(".razor")) out.push(full);
    }
    return out;
}

const files = collect(".", []);
let count = 0;
for (const file of files) {
    let passes = 0;
    let touched = false;
    while (passes < 12 && formatFile(file)) {
        touched = true;
        passes++;
    }
    if (touched) count++;
}
console.log(`razor attribute formatting: ${count} file(s) changed of ${files.length}`);
if (process.env.FORMAT_CHECK === "1" && count > 0) process.exit(1);
