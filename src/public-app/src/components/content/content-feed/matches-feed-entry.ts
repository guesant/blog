import type { FeedEntry } from './types';
import { entryMatchesFixedKind } from './entry-matches-fixed-kind';
import { entryMatchesTopic } from './entry-matches-topic';
import { entryMatchesType } from './entry-matches-type';
import { entryMatchesSearch } from './entry-matches-search';

type MatchesFeedEntryProps = {
  entry: FeedEntry;
  fixedKind?: string;
  kind: string;
  topic: string;
  type: string;
  search: string;
};

export function matchesFeedEntry(props: MatchesFeedEntryProps): boolean {
  return (
    entryMatchesFixedKind(props) &&
    entryMatchesTopic(props) &&
    entryMatchesType(props) &&
    entryMatchesSearch(props.entry, props.search)
  );
}
