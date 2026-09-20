import type { FeedEntry, SortMode } from './types';
import { matchesFeedEntry } from './matches-feed-entry';
import { sortFeedEntries } from './sort-feed-entries';

type FilterFeedEntriesProps = {
  entries: FeedEntry[];
  fixedKind?: string;
  kind: string;
  topic: string;
  type: string;
  search: string;
  sort: SortMode;
  serverManaged: boolean;
};

export function filterFeedEntries(props: FilterFeedEntriesProps): FeedEntry[] {
  if (props.serverManaged) {
    return props.entries;
  }

  const filtered = props.entries.filter((entry) => matchesFeedEntry({ ...props, entry }));

  return sortFeedEntries(filtered, props.sort);
}
