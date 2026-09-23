type ContentFeedPageNumberProps = {
  serverPage: number | undefined;
  requestedPage: number;
  pageCount: number;
};

export function contentFeedPageNumber(props: ContentFeedPageNumberProps): number {
  return props.serverPage ?? Math.min(Math.max(props.requestedPage, 1), props.pageCount);
}
