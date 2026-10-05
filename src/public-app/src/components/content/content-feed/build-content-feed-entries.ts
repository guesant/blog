import { buildFeedItemEntry } from './build-feed-item-entry';
import type { ContentFeedProps, FeedEntry } from './types';

type BuildContentFeedEntriesProps = Pick<ContentFeedProps, 'feedItems'>;

export function buildContentFeedEntries(props: BuildContentFeedEntriesProps): FeedEntry[] {
  return props.feedItems.map(buildFeedItemEntry);
}
