import type { FeedEntry, SortMode } from './types';

export function sortFeedEntries(entries: FeedEntry[], sort: SortMode): FeedEntry[] {
  const comparators: Record<SortMode, (left: FeedEntry, right: FeedEntry) => number> = {
    alpha: (left, right) => left.title.localeCompare(right.title),
    asc: (left, right) =>
      left.date.localeCompare(right.date) || left.title.localeCompare(right.title),
    popular: (left, right) => (right.popularityRank || 0) - (left.popularityRank || 0),
    desc: (left, right) =>
      right.date.localeCompare(left.date) || left.title.localeCompare(right.title),
  };

  return [...entries].sort(comparators[sort]);
}
