type ContentFeedPageMeta = {
  total: number;
  perPage: number | undefined;
  page: number | undefined;
};

type ContentFeedPageMetaProps = {
  findingsMeta?: ContentFeedPageMeta;
  contentMeta?: ContentFeedPageMeta;
  entryCount: number;
};

export function contentFeedPageMeta(props: ContentFeedPageMetaProps): ContentFeedPageMeta {
  if (props.findingsMeta) return props.findingsMeta;
  if (props.contentMeta) return props.contentMeta;

  return { total: props.entryCount, perPage: undefined, page: undefined };
}
