import type { ServerCacheEntry } from './content-data-server-cache-types';

export function readFreshServerCache<T>(
  entry: ServerCacheEntry<T> | undefined,
  now: number,
): T | undefined {
  if (entry?.value !== undefined && entry.expiresAt > now) {
    entry.lastAccessAt = now;

    return entry.value;
  }

  return undefined;
}
