import { chromium } from "@playwright/test";
import lighthouse from "lighthouse";
import { writeFileSync } from "node:fs";
import { layoutAuditConfig } from "../layout-audit.config.ts";

const REMOTE_DEBUGGING_PORT = 9222;
const CATEGORIES = ["performance", "accessibility", "best-practices", "seo"] as const;

const sampleRoutes = [
    { path: "/", label: "home" },
    { path: "/findings", label: "findings-list" },
    { path: "/findings/raft-refresher", label: "finding-detail" },
];

type CategoryScore = { category: string; score: number | null };

type AuditFailure = {
    id: string;
    title: string;
    score: number | null;
    displayValue?: string;
    description: string;
};

type RouteReport = {
    label: string;
    path: string;
    scores: CategoryScore[];
    failures: AuditFailure[];
};

async function auditRoute(
    url: string,
): Promise<{ scores: CategoryScore[]; failures: AuditFailure[] }> {
    const runnerResult = await lighthouse(url, {
        port: REMOTE_DEBUGGING_PORT,
        output: "json",
        onlyCategories: [...CATEGORIES],
        formFactor: "desktop",
        screenEmulation: { disabled: true },
        logLevel: "error",
    });

    if (!runnerResult?.lhr) throw new Error(`lighthouse produced no result for ${url}`);
    const lhr = runnerResult.lhr;

    const scores: CategoryScore[] = CATEGORIES.map((category) => ({
        category,
        score: lhr.categories[category]?.score ?? null,
    }));

    const failures: AuditFailure[] = Object.values(lhr.audits)
        .filter(
            (audit) =>
                audit.score !== null &&
                audit.score < 1 &&
                audit.scoreDisplayMode !== "notApplicable",
        )
        .map((audit) => ({
            id: audit.id,
            title: audit.title,
            score: audit.score,
            displayValue: audit.displayValue,
            description: audit.description,
        }))
        .sort((a, b) => (a.score ?? 0) - (b.score ?? 0));

    return { scores, failures };
}

async function main(): Promise<void> {
    const browser = await chromium.launch({
        args: [`--remote-debugging-port=${REMOTE_DEBUGGING_PORT}`],
    });
    await browser.newPage();

    const reports: RouteReport[] = [];

    for (const route of sampleRoutes) {
        const url = new URL(route.path, layoutAuditConfig.baseURL).toString();
        const { scores, failures } = await auditRoute(url);
        reports.push({ label: route.label, path: route.path, scores, failures });
    }

    await browser.close();

    const lines: string[] = [];
    lines.push("# Lighthouse audit");
    lines.push("");
    lines.push(`Routes sampled: ${reports.map((report) => report.path).join(", ")}.`);
    lines.push("");

    for (const report of reports) {
        lines.push(`## ${report.label} (${report.path})`);
        lines.push("");
        lines.push(
            report.scores
                .map(
                    (score) =>
                        `${score.category}: ${score.score === null ? "n/a" : Math.round(score.score * 100)}`,
                )
                .join(" | "),
        );
        lines.push("");
        if (report.failures.length === 0) {
            lines.push("No failing audits.");
        } else {
            lines.push(`Failing audits (${report.failures.length}):`);
            for (const failure of report.failures) {
                const scoreLabel = failure.score === null ? "n/a" : Math.round(failure.score * 100);
                lines.push(
                    `- [${scoreLabel}] ${failure.id} — ${failure.title}${failure.displayValue ? ` (${failure.displayValue})` : ""}`,
                );
                lines.push(`  ${failure.description.replace(/\s+/g, " ").trim()}`);
            }
        }
        lines.push("");
    }

    const report = lines.join("\n");
    process.stdout.write(`${report}\n`);
    writeFileSync(new URL("../lighthouse-report.md", import.meta.url), report, "utf8");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
