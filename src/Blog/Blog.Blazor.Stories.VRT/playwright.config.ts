import { defineConfig } from "@playwright/test";
import { vrtConfig } from "./vrt.config.ts";

const baseURL = vrtConfig.baseURL;

export default defineConfig({
    testDir: "./tests",
    globalSetup: "./scripts/global-setup.ts",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    workers: 4,
    reporter: [["html", { open: "never" }]],
    use: {
        baseURL,
        ignoreHTTPSErrors: true,
        viewport: { width: 900, height: 600 },
    },
    expect: {
        toHaveScreenshot: {
            maxDiffPixelRatio: 0.001,
        },
    },
});
