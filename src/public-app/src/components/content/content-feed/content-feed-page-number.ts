type ContentFeedPageNumberProps = {
  serverManaged: boolean;
  serverPage: number | undefined;
  requestedPage: number;
  pageCount: number;
};

export function contentFeedPageNumber(props: ContentFeedPageNumberProps): number {
  if (props.serverManaged) {
    return props.serverPage ?? 1;
  }

  return Math.min(Math.max(props.requestedPage, 1), props.pageCount);
}
