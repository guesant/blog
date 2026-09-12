import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const allow = readFileSync(join(root, "tools/checks/hardcoded-text-allowlist.txt"), "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
        const [scope, ...rest] = line.split("|");
        return { scope, text: rest.join("|") };
    });
const textAttributes = new Set([
    "Label",
    "Title",
    "Placeholder",
    "aria-label",
    "AriaLabel",
    "alt",
    "Summary",
    "Description",
    "EmptyText",
    "Message",
    "Lead",
    "ApplyLabel",
    "ClearLabel",
    "ViewLabel",
    "KindLabel",
    "BackLabel",
    "HomeLabel",
    "CurrentLabel",
    "ExternalLabel",
    "Hint",
    "Caption",
    "Eyebrow",
    "title",
    "placeholder",
]);
const phrase = /[A-Za-zÀ-ÿ]{2,}[\s,.;:!?]+[A-Za-zÀ-ÿ]{2,}/;
const words = new RegExp(`${phrase.source}|^[A-Za-zÀ-ÿ]{4,}[.!?…]?$`);
const acronym = /^[A-Z][A-Za-z0-9]*[A-Z0-9][A-Za-z0-9]*$|^[A-Z]{2,}(\s[A-Z][a-z]+)?$/;
const classList = /^[a-z0-9]+(-[a-z0-9]+)+( [a-z0-9]+(-[a-z0-9]+)+)+$/;
const codeLike = /[(){}=<>;|&!@$\\]|=>|\.\w+\(/;

function walk(dir, out = []) {
    for (const entry of readdirSync(dir)) {
        if (entry === "obj" || entry === "bin") continue;
        const path = join(dir, entry);
        if (statSync(path).isDirectory()) walk(path, out);
        else out.push(path);
    }
    return out;
}

function allowed(path, text) {
    return allow.some(
        (rule) => (rule.scope === "*" || path.startsWith(rule.scope)) && rule.text === text,
    );
}

const files = [
    ...walk(join(root, "src/Blog/Blog.Blazor.Client")),
    ...walk(join(root, "src/Blog/Blog.Blazor.UI")).filter((path) => path.endsWith(".razor")),
].filter((path) => /\.(razor|cs)$/.test(path) && !path.endsWith(".stories.razor"));

const problems = [];
for (const file of files) {
    const path = file.slice(root.length + 1);
    let text = readFileSync(file, "utf8").replace(/@\*[\s\S]*?\*@/g, "");
    if (path.endsWith(".razor")) {
        text = text.replace(
            /^\s*(\/\/\/|@inject|@using|@inherits|@page|@attribute|@implements|@layout).*$/gm,
            "",
        );
        for (const match of text.matchAll(/>([^<>]+)</g)) {
            const value = match[1].replace(/\s+/g, " ").trim();
            if (!value || value.includes("@") || codeLike.test(value) || acronym.test(value))
                continue;
            if (words.test(value) && !allowed(path, value))
                problems.push(`${path}: text "${value}"`);
        }
        for (const match of text.matchAll(/\s([A-Za-z-]+)="([^"@]*)"/g)) {
            const [, name, value] = match;
            if (!textAttributes.has(name)) continue;
            const trimmed = value.trim();
            if (trimmed.includes("://") || acronym.test(trimmed)) continue;
            if (words.test(trimmed) && !allowed(path, trimmed))
                problems.push(`${path}: ${name}="${trimmed}"`);
        }
    } else {
        for (const line of text.split("\n")) {
            const code = line.replace(/\/\/.*$/, "");
            if (/LoggerMessage|Message\s*=|nameof\(/.test(code)) continue;
            for (const match of code.matchAll(/(?<![$@\w])"((?:[^"\\]|\\.)*)"/g)) {
                const value = match[1];
                if (value.includes("{") || value.includes("/") || value.includes("\\n")) continue;
                if (
                    /yyyy|MMM|HH:/.test(value) ||
                    codeLike.test(value) ||
                    classList.test(value) ||
                    /^[\w.-]+\.[\w.-]+$/.test(value)
                )
                    continue;
                if (phrase.test(value) && !allowed(path, value))
                    problems.push(`${path}: "${value}"`);
            }
        }
    }
}

if (problems.length > 0) {
    console.error(
        "hardcoded text check failed (localize it or add it to tools/checks/hardcoded-text-allowlist.txt):",
    );
    for (const problem of problems) console.error(`  ${problem}`);
    process.exit(1);
}
console.log("hardcoded text checks passed");
