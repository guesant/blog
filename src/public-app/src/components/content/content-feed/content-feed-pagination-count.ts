import type { UseContentFeedViewPropsInput } from './use-content-feed-view-props.types';

export function contentFeedPaginationCount(input: UseContentFeedViewPropsInput): number {
  return input.props.contentMeta?.total ?? 0;
}
