export interface StoryIndexEntry {
    id: string;
    title: string;
    name: string;
    type: "story" | "docs";
}

export interface StoryIndex {
    v: number;
    entries: Record<string, StoryIndexEntry>;
}

declare global {
    const BlazingStory: {
        getStoryIndex(): Promise<StoryIndex>;
        readyView(): Promise<void>;
    };
}
