import type { UseContentFeedViewPropsInput } from './use-content-feed-view-props.types';

export function contentFeedPaginationCount(input: UseContentFeedViewPropsInput): number {
  if (!input.runtime.data.serverManaged) return input.runtime.data.filteredEntries.length;
  if (input.props.findingsMeta) return input.props.findingsMeta.total;

  return input.props.contentMeta?.total ?? 0;
}
