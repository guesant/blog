import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const MAX_LENGTH = 100;

function statementBreaks(line) {
    const breaks = [];
    let depth = 0;
    let quote = null;
    for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (quote) {
            if (ch === "\\") i++;
            else if (ch === quote) quote = null;
            continue;
        }
        if (ch === '"' || ch === "'") {
            quote = ch;
            continue;
        }
        if (ch === "(" || ch === "[" || ch === "{") depth++;
        else if (ch === ")" || ch === "]" || ch === "}") depth--;
        else if (ch === ";" && depth === 0 && i < line.length - 1) breaks.push(i);
        if (ch === "}" && depth === 0 && i < line.length - 1) {
            const rest = line.slice(i + 1);
            if (/^\s+(\[|private\s|protected\s|internal\s|public\s|static\s)/.test(rest))
                breaks.push(i);
        }
    }
    breaks.sort((a, b) => a - b);
    return quote === null && depth === 0 ? breaks : [];
}

function splitStatements(line) {
    if (line.length <= MAX_LENGTH) return null;
    if (/^\s*(\/\/|\*|@\*)/.test(line)) return null;
    if (line.includes("//") || line.includes("/*")) return null;
    const breaks = statementBreaks(line);
    if (breaks.length === 0) return null;
    const indent = line.match(/^(\s*)/)[1];

    const parts = [];
    let start = 0;
    for (const at of breaks) {
        parts.push(line.slice(start, at + 1).trim());
        start = at + 1;
    }
    const tail = line.slice(start).trim();
    if (tail.length > 0) parts.push(tail);
    if (parts.length < 2) return null;
    return parts.map((part) => indent + part).join("\n");
}

function formatFile(path) {
    const source = readFileSync(path, "utf8");
    const isRazor = path.endsWith(".razor");
    const lines = source.split("\n");
    const out = [];
    let inCode = !isRazor;
    let changed = false;

    for (const line of lines) {
        if (isRazor && /^\s*@code\s*\{/.test(line)) {
            inCode = true;
            out.push(line);
            continue;
        }
        if (!inCode || line.length <= MAX_LENGTH) {
            out.push(line);
            continue;
        }
        const split = splitStatements(line);
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
    if (formatFile(file)) count++;
}
console.log(`c# statement formatting: ${count} file(s) changed of ${files.length}`);
if (process.env.FORMAT_CHECK === "1" && count > 0) process.exit(1);
