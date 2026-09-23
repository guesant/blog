import { buildEntries } from './build-entries';
import { buildFeedItemEntry } from './build-feed-item-entry';
import { buildFindingEntries } from './build-finding-entries';
import type { ContentFeedProps, FeedEntry } from './types';

type BuildContentFeedEntriesProps = Pick<
  ContentFeedProps,
  'feedItems' | 'writings' | 'findings' | 'collections' | 'fixedKind'
>;

export function buildContentFeedEntries(props: BuildContentFeedEntriesProps): FeedEntry[] {
  if (props.feedItems) {
    return props.feedItems.map(buildFeedItemEntry);
  }

  if (props.fixedKind === 'achado') {
    return buildFindingEntries(props.findings);
  }

  if (props.fixedKind === 'post') {
    return buildEntries(props.writings, [], []);
  }

  if (props.fixedKind === 'colecao') {
    return buildEntries([], [], props.collections);
  }

  return buildEntries(props.writings, props.findings, props.collections);
}
