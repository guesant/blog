import { buildEntries } from './build-entries';
import { buildFindingEntries } from './build-finding-entries';
import type { ContentFeedProps, FeedEntry } from './types';

type BuildContentFeedEntriesProps = Pick<
  ContentFeedProps,
  'writings' | 'findings' | 'collections'
> & {
  serverManaged: boolean;
};

export function buildContentFeedEntries(props: BuildContentFeedEntriesProps): FeedEntry[] {
  if (props.serverManaged) {
    return buildFindingEntries(props.findings);
  }

  return buildEntries(props.writings, props.findings, props.collections);
}
