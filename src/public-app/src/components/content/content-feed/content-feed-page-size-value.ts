const contentFeedPageSizeOptions = [10, 20, 50] as const;

export function contentFeedPageSizeValue(value: string | null, fallback = 10): number {
  const parsed = Number(value);

  return contentFeedPageSizeOptions.includes(parsed as (typeof contentFeedPageSizeOptions)[number])
    ? parsed
    : fallback;
}
