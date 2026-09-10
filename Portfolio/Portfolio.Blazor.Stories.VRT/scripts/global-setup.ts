import type { FullConfig } from "@playwright/test";
import generateStoryIndex from "./gen-stories.ts";

export default async function globalSetup(config: FullConfig): Promise<void> {
    await generateStoryIndex(config);
}
