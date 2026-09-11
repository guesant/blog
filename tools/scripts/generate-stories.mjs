import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, basename, join } from "node:path";

const SAMPLES = {
    string: '"sample"',
    bool: "true",
    int: "1",
    double: "1.0",
};

function requiredParameters(source) {
    const out = [];
    const pattern =
        /\[Parameter[^\]]*EditorRequired[^\]]*\]\s*\r?\n\s*public\s+([^\s]+(?:<[^>]*>)?)\s+(\w+)\s*\{/g;
    let match;
    while ((match = pattern.exec(source)) !== null) {
        out.push({ type: match[1], name: match[2] });
    }
    return out;
}

function valueFor(type, name) {
    const bare = type.replace(/\?$/, "");
    if (bare === "RenderFragment") return null;
    if (bare in SAMPLES) return SAMPLES[bare];
    if (bare.startsWith("IReadOnlyList") || bare.startsWith("List")) return "[]";
    if (bare.startsWith("Func<int, string>") || bare.startsWith("Func<int,string>"))
        return '@(page => $"?page={page}")';
    if (bare.startsWith("Func<")) return null;
    if (bare.startsWith("EventCallback")) return null;
    if (bare === "SiteTone") return "SiteTone.Info";
    return null;
}

const files = readFileSync("/tmp/missing.txt", "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

let written = 0;
const skipped = [];

for (const file of files) {
    const source = readFileSync(file, "utf8");
    if (source.includes("@typeparam")) {
        skipped.push(`${file} (generic)`);
        continue;
    }

    const name = basename(file, ".razor");
    const folder = basename(dirname(file));
    const required = requiredParameters(source);

    const attributes = [];
    let unsupported = false;
    let childContent = null;

    for (const parameter of required) {
        if (parameter.type.replace(/\?$/, "") === "RenderFragment") {
            if (parameter.name === "ChildContent") childContent = true;
            else unsupported = true;
            continue;
        }
        const value = valueFor(parameter.type, parameter.name);
        if (value === null) {
            unsupported = true;
            break;
        }
        attributes.push(`${parameter.name}="${value.replace(/^"|"$/g, "")}"`);
    }

    if (unsupported) {
        skipped.push(`${file} (unsupported required parameter)`);
        continue;
    }

    const attributeText = attributes.length > 0 ? " " + attributes.join(" ") : "";
    const body = childContent
        ? `<${name}${attributeText}>sample</${name}>`
        : `<${name}${attributeText} />`;

    const target = join(
        "src/Portfolio/Portfolio.Blazor.Stories/Stories",
        folder,
        `${name}.stories.razor`,
    );
    if (existsSync(target)) continue;
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(
        target,
        `@attribute [Stories("${folder}/${name}")]\n\n<Stories TComponent="${name}">\n\n    <Story Name="Default">\n        <Template>\n            ${body}\n        </Template>\n    </Story>\n\n</Stories>\n`,
    );
    written++;
}

console.log(`generated ${written} stories`);
console.log(`skipped ${skipped.length}:`);
for (const entry of skipped) console.log(`  ${entry}`);
