import type { FeedEntry } from './types';

export function entryMatchesSearch(
  entry: FeedEntry,
  search: string,
  matchingSlugs: Set<string> | null = null,
): boolean {
  if (!search.trim()) {
    return true;
  }
  if (matchingSlugs) {
    return matchingSlugs.has(entry.slug);
  }

  const needle = search.trim().toLocaleLowerCase();

  return `${entry.title} ${entry.preview}`.toLocaleLowerCase().includes(needle);
}
