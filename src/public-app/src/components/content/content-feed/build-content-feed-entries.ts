import { buildEntries } from './build-entries';
import { buildFindingEntries } from './build-finding-entries';
import type { ContentFeedProps, FeedEntry } from './types';

type BuildContentFeedEntriesProps = Pick<
  ContentFeedProps,
  'writings' | 'findings' | 'collections' | 'fixedKind'
> & {
  serverManaged: boolean;
};

export function buildContentFeedEntries(props: BuildContentFeedEntriesProps): FeedEntry[] {
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
