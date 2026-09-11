import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { StoryIndexEntry } from "../types/blazing-story.js";

function loadStories(): StoryIndexEntry[] {
    try {
        const json = readFileSync(join(import.meta.dirname, "stories.json"), "utf8");
        return JSON.parse(json) as StoryIndexEntry[];
    } catch {
        return [];
    }
}

const stories = loadStories().filter((e) => e.type === "story");

for (const story of stories) {
    test(`${story.title} - ${story.name}`, async ({ page }) => {
        await page.goto(`/iframe.html?id=${encodeURIComponent(story.id)}&viewMode=story`);
        await page.waitForLoadState("networkidle");
        await page.waitForFunction(() =>
            typeof BlazingStory === "undefined" ? false : BlazingStory.readyView().then(() => true),
        );
        await expect(page).toHaveScreenshot(`${story.id}.png`);
    });
}
