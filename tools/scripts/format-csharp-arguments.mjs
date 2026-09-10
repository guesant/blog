import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const MAX_LENGTH = 100;

function topLevelCommas(line, open, close) {
    const commas = [];
    let depth = 0;
    let quote = null;
    for (let i = open + 1; i < close; i++) {
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
        if (ch === "(" || ch === "[" || ch === "{" || ch === "<") depth++;
        else if (ch === ")" || ch === "]" || ch === "}" || ch === ">") depth--;
        else if (ch === "," && depth === 0) commas.push(i);
    }
    return quote === null && depth === 0 ? commas : [];
}

function outermostCall(line) {
    let depth = 0;
    let quote = null;
    let open = -1;
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
        if (ch === "(") {
            if (depth === 0) open = i;
            depth++;
        } else if (ch === ")") {
            depth--;
            if (depth === 0 && open !== -1) return { open, close: i };
        }
    }
    return null;
}

function wrapArguments(line) {
    if (line.length <= MAX_LENGTH) return null;
    if (/(\/\/|\/\*|@"|""")/.test(line)) return null;
    const call = outermostCall(line);
    if (call === null) return null;
    const commas = topLevelCommas(line, call.open, call.close);
    if (commas.length === 0) return null;

    const indent = line.match(/^(\s*)/)[1];
    const continuation = indent + "    ";
    const parts = [];
    let start = call.open + 1;
    for (const at of commas) {
        parts.push(line.slice(start, at + 1).trim());
        start = at + 1;
    }
    parts.push(line.slice(start, call.close).trim());

    const head = line.slice(0, call.open + 1);
    const tail = line.slice(call.close);
    const wrapped = [head, ...parts.map((part) => continuation + part), indent + tail].join("\n");
    const longest = Math.max(...wrapped.split("\n").map((l) => l.length));
    return longest < line.length ? wrapped : null;
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
        const wrapped = wrapArguments(line);
        if (wrapped === null) {
            out.push(line);
            continue;
        }
        changed = true;
        out.push(wrapped);
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
console.log(`c# argument wrapping: ${count} file(s) changed of ${files.length}`);
if (process.env.FORMAT_CHECK === "1" && count > 0) process.exit(1);
