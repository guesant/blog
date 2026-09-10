import { chromium, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { writeFileSync } from "node:fs";
import { layoutAuditConfig, routes, viewports } from "../layout-audit.config.ts";
import { openAllDisclosures } from "./audit-page.ts";

const HYDRATION_SCRIPT_GLOB = "**/_framework/blazor.web*.js";
const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"];
const passes = ["static", "hydrated"] as const;
type Pass = (typeof passes)[number];

const desktop = viewports.find((viewport) => viewport.name === "desktop");
if (!desktop) throw new Error("desktop viewport is not configured");

type Occurrence = {
    route: string;
    pass: Pass;
    target: string;
    html: string;
    failureSummary: string;
};

type RuleGroup = {
    id: string;
    impact: string;
    description: string;
    help: string;
    helpUrl: string;
    occurrences: Occurrence[];
};

async function scanRoute(page: Page, path: string, pass: Pass) {
    if (pass === "static") {
        await page.route(HYDRATION_SCRIPT_GLOB, (route) => route.abort());
    }
    await page.setViewportSize({ width: desktop!.width, height: desktop!.height });
    await page.goto(new URL(path, layoutAuditConfig.baseURL).toString());
    await page.waitForLoadState("networkidle");
    await page.evaluate(openAllDisclosures);
    return new AxeBuilder({ page })
        .options({ rules: { "target-size": { enabled: true } } })
        .withTags(AXE_TAGS)
        .analyze();
}

async function main(): Promise<void> {
    const browser = await chromium.launch();
    const groups = new Map<string, RuleGroup>();
    const routeErrors: string[] = [];

    for (const route of routes) {
        for (const pass of passes) {
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                const results = await scanRoute(page, route.path, pass);
                for (const violation of results.violations) {
                    let group = groups.get(violation.id);
                    if (!group) {
                        group = {
                            id: violation.id,
                            impact: violation.impact ?? "unknown",
                            description: violation.description,
                            help: violation.help,
                            helpUrl: violation.helpUrl,
                            occurrences: [],
                        };
                        groups.set(violation.id, group);
                    }
                    for (const node of violation.nodes) {
                        group.occurrences.push({
                            route: route.path,
                            pass,
                            target: node.target.join(" "),
                            html: node.html.replace(/\s+/g, " ").trim(),
                            failureSummary: (node.failureSummary ?? "").replace(/\s+/g, " ").trim(),
                        });
                    }
                }
            } catch (error) {
                routeErrors.push(`${route.path} (${pass}): ${(error as Error).message}`);
            } finally {
                await context.close();
            }
        }
    }

    await browser.close();

    const sortedGroups = [...groups.values()].sort(
        (a, b) => b.occurrences.length - a.occurrences.length,
    );
    const totalOccurrences = sortedGroups.reduce((sum, group) => sum + group.occurrences.length, 0);

    const lines: string[] = [];
    lines.push("# axe-core WCAG 2.2 AA audit");
    lines.push("");
    lines.push(
        `Viewport: desktop (${desktop!.width}x${desktop!.height}). Passes: static (pre-hydration), hydrated.`,
    );
    lines.push(`Routes scanned: ${routes.length}. Rules tagged: ${AXE_TAGS.join(", ")}.`);
    lines.push(
        `Distinct rules violated: ${sortedGroups.length}. Total occurrences: ${totalOccurrences}.`,
    );
    if (routeErrors.length > 0) {
        lines.push("");
        lines.push("## Scan errors");
        for (const message of routeErrors) lines.push(`- ${message}`);
    }
    lines.push("");

    for (const group of sortedGroups) {
        lines.push(
            `## ${group.id} — impact: ${group.impact} — ${group.occurrences.length} occurrence(s)`,
        );
        lines.push("");
        lines.push(group.description);
        lines.push(`${group.help} (${group.helpUrl})`);
        lines.push("");
        for (const occurrence of group.occurrences) {
            lines.push(
                `- route=${occurrence.route} pass=${occurrence.pass} selector=\`${occurrence.target}\``,
            );
            lines.push(`  html: \`${occurrence.html.slice(0, 300)}\``);
            if (occurrence.failureSummary) lines.push(`  why: ${occurrence.failureSummary}`);
        }
        lines.push("");
    }

    const report = lines.join("\n");
    process.stdout.write(`${report}\n`);
    writeFileSync(new URL("../a11y-report.md", import.meta.url), report, "utf8");

    if (routeErrors.length > 0) process.exitCode = 1;
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
