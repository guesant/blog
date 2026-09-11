import { chromium, type Page } from "@playwright/test";
import { writeFileSync } from "node:fs";
import { layoutAuditConfig } from "../layout-audit.config.ts";

const HYDRATION_SCRIPT_GLOB = "**/_framework/blazor.web*.js";
const passes = ["static", "hydrated"] as const;
type Pass = (typeof passes)[number];

const sampleRoutes = [
    { path: "/", label: "home" },
    { path: "/findings", label: "findings-list" },
    { path: "/findings/raft-refresher", label: "finding-detail" },
];

type SeoSnapshot = {
    title: string;
    metaDescription: string | null;
    canonical: string | null;
    ogTitle: string | null;
    ogDescription: string | null;
    ogImage: string | null;
    ogType: string | null;
};

function extractSeoSnapshot(): SeoSnapshot {
    const meta = (name: string) =>
        document.querySelector(`meta[name="${name}"]`)?.getAttribute("content") ?? null;
    const og = (property: string) =>
        document.querySelector(`meta[property="${property}"]`)?.getAttribute("content") ?? null;
    return {
        title: document.title,
        metaDescription: meta("description"),
        canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? null,
        ogTitle: og("og:title"),
        ogDescription: og("og:description"),
        ogImage: og("og:image"),
        ogType: og("og:type"),
    };
}

async function snapshotRoute(page: Page, path: string, pass: Pass): Promise<SeoSnapshot> {
    if (pass === "static") {
        await page.route(HYDRATION_SCRIPT_GLOB, (route) => route.abort());
    }
    await page.goto(new URL(path, layoutAuditConfig.baseURL).toString());
    await page.waitForLoadState("networkidle");
    return page.evaluate(extractSeoSnapshot);
}

function missingFields(snapshot: SeoSnapshot): string[] {
    const missing: string[] = [];
    if (!snapshot.title) missing.push("title");
    if (!snapshot.metaDescription) missing.push("meta description");
    if (!snapshot.canonical) missing.push("canonical link");
    if (!snapshot.ogTitle) missing.push("og:title");
    if (!snapshot.ogDescription) missing.push("og:description");
    if (!snapshot.ogImage) missing.push("og:image");
    if (!snapshot.ogType) missing.push("og:type");
    return missing;
}

async function main(): Promise<void> {
    const browser = await chromium.launch();
    const lines: string[] = [];
    lines.push("# SEO / meta / Open Graph audit");
    lines.push("");
    lines.push(
        `Routes sampled: ${sampleRoutes.map((route) => route.path).join(", ")}. Passes: static, hydrated.`,
    );
    lines.push("");

    for (const route of sampleRoutes) {
        lines.push(`## ${route.label} (${route.path})`);
        lines.push("");
        for (const pass of passes) {
            const page = await browser.newPage();
            let snapshot: SeoSnapshot;
            try {
                snapshot = await snapshotRoute(page, route.path, pass);
            } finally {
                await page.close();
            }
            const missing = missingFields(snapshot);
            lines.push(`### ${pass}`);
            lines.push(`- title: ${snapshot.title || "(missing)"}`);
            lines.push(`- meta description: ${snapshot.metaDescription ?? "(missing)"}`);
            lines.push(`- canonical: ${snapshot.canonical ?? "(missing)"}`);
            lines.push(`- og:title: ${snapshot.ogTitle ?? "(missing)"}`);
            lines.push(`- og:description: ${snapshot.ogDescription ?? "(missing)"}`);
            lines.push(`- og:image: ${snapshot.ogImage ?? "(missing)"}`);
            lines.push(`- og:type: ${snapshot.ogType ?? "(missing)"}`);
            lines.push(
                missing.length === 0
                    ? "- result: all fields present"
                    : `- result: MISSING ${missing.join(", ")}`,
            );
            lines.push("");
        }
    }

    await browser.close();

    const report = lines.join("\n");
    process.stdout.write(`${report}\n`);
    writeFileSync(new URL("../seo-report.md", import.meta.url), report, "utf8");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
