import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, basename } from "node:path";

const root = process.cwd();
const localizationDir = join(root, "Portfolio/Portfolio.Blazor.Core/Localization");
const fix = process.env.FIX === "1";
const locales = ["", ".pt-BR"];
const resources = {
    SharedResource: ["L", "SharedL", "localizer"],
    NavigationResource: ["NavL"],
    ToolsResource: ["ToolsL"],
    ValidationResource: [],
    ContentResource: [],
};
const dynamicRules = readList("tools/checks/resx-dynamic-prefixes.txt").map((rule) =>
    rule.startsWith("^")
        ? new RegExp(rule)
        : new RegExp(`^${rule.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`),
);
const frozenLegacy = new Set(readList("tools/checks/resx-legacy-keys.txt"));

function readList(path) {
    return readFileSync(join(root, path), "utf8")
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith("#"));
}

function walk(dir, out = []) {
    for (const entry of readdirSync(dir)) {
        if (entry === "obj" || entry === "bin" || entry === "node_modules") continue;
        const path = join(dir, entry);
        if (statSync(path).isDirectory()) walk(path, out);
        else if (/\.(cs|razor)$/.test(entry)) out.push(path);
    }
    return out;
}

const sources = walk(join(root, "Portfolio")).map((path) => ({
    path: path.slice(root.length + 1),
    text: readFileSync(path, "utf8"),
}));
const allCode = sources.map((source) => source.text).join("\n");

function parse(path) {
    const text = readFileSync(path, "utf8");
    const keys = new Map();
    for (const match of text.matchAll(/^(\s*<data name="([^"]+)">.*<\/data>\s*)$/gm)) {
        keys.set(match[2], match[1]);
    }
    return { text, keys };
}

const problems = [];
for (const [resource, accessors] of Object.entries(resources)) {
    const files = locales.map((locale) => join(localizationDir, `${resource}${locale}.resx`));
    const parsed = files.map(parse);
    const [base, ...others] = parsed;
    for (const [index, other] of others.entries()) {
        for (const key of base.keys.keys()) {
            if (!other.keys.has(key)) problems.push(`${basename(files[index + 1])} lacks ${key}`);
        }
        for (const key of other.keys.keys()) {
            if (!base.keys.has(key)) problems.push(`${basename(files[0])} lacks ${key}`);
        }
    }
    const unused = [];
    for (const key of base.keys.keys()) {
        if (key === "resmimetype" || key === "version" || key === "reader" || key === "writer")
            continue;
        if (dynamicRules.some((rule) => rule.test(key))) continue;
        if (!allCode.includes(`"${key}"`)) {
            unused.push(key);
            continue;
        }
        if (key.startsWith("legacy_") && !frozenLegacy.has(key)) {
            problems.push(
                `${resource}: ${key} is a new legacy_ key; give new keys a descriptive name`,
            );
        }
    }
    if (unused.length > 0) {
        if (fix) {
            for (const [index, file] of files.entries()) {
                let text = parsed[index].text;
                for (const key of unused) {
                    const line = parsed[index].keys.get(key);
                    if (line) text = text.replace(line + "\n", "");
                }
                writeFileSync(file, text);
            }
            console.log(`${resource}: removed ${unused.length} unused keys`);
        } else {
            problems.push(
                `${resource}: ${unused.length} keys are never referenced (${unused.slice(0, 5).join(", ")}...); run just resx-keys-fix`,
            );
        }
    }
    if (accessors.length === 0) continue;
    const pattern = new RegExp(`\\b(?:${accessors.join("|")})\\[\\s*"([A-Za-z0-9_]+)"`, "g");
    for (const source of sources) {
        for (const match of source.text.matchAll(pattern)) {
            if (!base.keys.has(match[1]))
                problems.push(`${source.path}: key ${match[1]} is missing from ${resource}`);
        }
    }
}

if (problems.length > 0) {
    console.error("resx key check failed:");
    for (const problem of problems) console.error(`  ${problem}`);
    process.exit(1);
}
console.log("resx key checks passed");
