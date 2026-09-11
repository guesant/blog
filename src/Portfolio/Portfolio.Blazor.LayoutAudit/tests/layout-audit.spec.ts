import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { routes, viewports } from "../layout-audit.config.ts";
import { auditPage, openAllDisclosures, type Violation } from "../scripts/audit-page.ts";

const HYDRATION_SCRIPT_GLOB = "**/_framework/blazor.web*.js";

type AllowlistEntry = {
    route: string;
    type: Violation["type"] | "runtime-error";
    match: string;
    reason: string;
};

const allowlist: AllowlistEntry[] = JSON.parse(
    readFileSync(join(import.meta.dirname, "..", "allowlist.json"), "utf8"),
);

function isAllowedViolation(route: string, violation: Violation): boolean {
    return allowlist.some(
        (entry) =>
            (entry.route === route || entry.route === "*") &&
            entry.type === violation.type &&
            (entry.match.startsWith("*")
                ? violation.selector.includes(entry.match.slice(1))
                : entry.match === violation.selector),
    );
}

function isAllowedError(route: string, message: string): boolean {
    return allowlist.some(
        (entry) =>
            (entry.route === route || entry.route === "*") &&
            entry.type === "runtime-error" &&
            message.includes(entry.match),
    );
}

function describe(v: Violation): string {
    return `[${v.type}] ${v.selector} (parent: ${v.parentSelector}) actual=${v.actual} expected=${v.expected}`;
}

const passes = ["static", "hydrated"] as const;

for (const route of routes) {
    for (const viewport of viewports) {
        for (const pass of passes) {
            test(`${route.label} - ${viewport.name} - ${pass}`, async ({ page }) => {
                const runtimeErrors: string[] = [];
                page.on("pageerror", (error) => runtimeErrors.push(error.message));
                page.on("console", (message) => {
                    if (message.type() === "error") runtimeErrors.push(message.text());
                });

                if (pass === "static") {
                    // IMPORTANT: blocking the Blazor Web bootstrapper keeps the page frozen at its
                    // server-rendered, pre-hydration markup so auditPage() checks that shell directly.
                    await page.route(HYDRATION_SCRIPT_GLOB, (route) => route.abort());
                }

                await page.setViewportSize({ width: viewport.width, height: viewport.height });
                await page.goto(route.path);
                await page.waitForLoadState("networkidle");

                const unexplainedErrors = runtimeErrors.filter(
                    (message) => !isAllowedError(route.path, message),
                );
                expect(
                    unexplainedErrors,
                    `Runtime errors at ${route.path} (${viewport.name}, ${pass}):\n${unexplainedErrors.join("\n")}`,
                ).toEqual([]);

                await page.evaluate(openAllDisclosures);

                const violations = await page.evaluate(auditPage);
                const unexplainedViolations = violations.filter(
                    (v) => !isAllowedViolation(route.path, v),
                );

                expect(
                    unexplainedViolations,
                    `Layout violations at ${route.path} (${viewport.name}, ${pass}):\n${unexplainedViolations.map(describe).join("\n")}`,
                ).toEqual([]);
            });
        }
    }
}
