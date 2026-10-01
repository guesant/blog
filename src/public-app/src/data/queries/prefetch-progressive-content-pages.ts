const progressivePrefetchPageCount = 3;

type ProgressivePageFetcher = () => Promise<{ hasNextPage: boolean }>;

export async function prefetchProgressiveContentPages(
  fetchNextPage: ProgressivePageFetcher,
): Promise<void> {
  for (let pageOffset = 0; pageOffset < progressivePrefetchPageCount; pageOffset += 1) {
    const result = await fetchNextPage();

    if (!result.hasNextPage) {
      return;
    }
  }
}
