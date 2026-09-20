export function contentFeedRequestedPage(pageFromQuery: number, initialPage: number): number {
  return Number.isFinite(pageFromQuery) ? pageFromQuery : initialPage;
}
