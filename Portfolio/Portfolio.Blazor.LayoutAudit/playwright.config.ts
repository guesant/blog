import { defineConfig } from "@playwright/test";
import { layoutAuditConfig } from "./layout-audit.config.ts";

export default defineConfig({
    testDir: "./tests",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: 0,
    workers: 4,
    reporter: [["html", { open: "never" }], ["list"]],
    use: {
        baseURL: layoutAuditConfig.baseURL,
        ignoreHTTPSErrors: true,
    },
});
