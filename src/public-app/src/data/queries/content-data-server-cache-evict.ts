import type { ServerCache } from './content-data-server-cache-types';

export function evictOldestServerCacheEntry<T>(key: string, cache: ServerCache<T>): void {
  const oldest = [...cache.entries()]
    .filter(([entryKey]) => entryKey !== key)
    .sort(([, left], [, right]) => left.lastAccessAt - right.lastAccessAt)[0];

  if (oldest) {
    cache.delete(oldest[0]);
  }
}
