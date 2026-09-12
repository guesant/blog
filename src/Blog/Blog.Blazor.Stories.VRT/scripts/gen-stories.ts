import { chromium, type FullConfig } from "@playwright/test";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

export default async function generateStoryIndex(config: FullConfig): Promise<void> {
    const baseURL = config.projects[0].use.baseURL;

    const browser = await chromium.launch();
    try {
        const page = await browser.newPage({ ignoreHTTPSErrors: true });
        await page.goto(new URL("/", baseURL).href);
        await page.waitForFunction(() => typeof BlazingStory !== "undefined");
        const index = await page.evaluate(() => BlazingStory.getStoryIndex());

        const stories = Object.values(index.entries)
            .filter((e) => e.type === "story")
            .map(({ id, title, name, type }) => ({ id, title, name, type }));

        const out = join(import.meta.dirname, "..", "tests", "stories.json");
        writeFileSync(out, JSON.stringify(stories, null, 2) + "\n");
        console.log(`Wrote ${stories.length} stories to ${out}`);
    } finally {
        await browser.close();
    }
}
