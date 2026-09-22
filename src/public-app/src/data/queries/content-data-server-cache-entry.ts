import type { ServerCacheEntry } from './content-data-server-cache-types';

export function getServerCacheEntry<T>(
  current: ServerCacheEntry<T> | undefined,
  now: number,
): ServerCacheEntry<T> {
  if (current) {
    return current;
  }

  return { expiresAt: 0, lastAccessAt: now };
}
