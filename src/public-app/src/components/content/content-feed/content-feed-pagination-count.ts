import type { UseContentFeedViewPropsInput } from './use-content-feed-view-props.types';

export function contentFeedPaginationCount(input: UseContentFeedViewPropsInput): number {
  if (input.props.findingsMeta) return input.props.findingsMeta.total;

  return input.props.contentMeta?.total ?? 0;
}
