import { evictOldestServerCacheEntry } from './content-data-server-cache-evict';
import { getServerCacheMaxEntries } from './content-data-server-cache-max-entries';
import { getServerCacheStaleTime } from './content-data-server-cache-stale-time';
import type { ServerCacheUpdateOptions } from './content-data-server-cache-types';

export function updateServerCache<T>(props: ServerCacheUpdateOptions<T>): void {
  const { options, cache, entry, value } = props;

  if (cache.get(options.key) !== entry) {
    return;
  }

  const now = Date.now();

  entry.value = value;
  entry.expiresAt = now + getServerCacheStaleTime(options);
  entry.lastAccessAt = now;
  entry.promise = undefined;

  if (cache.size > getServerCacheMaxEntries(options)) {
    evictOldestServerCacheEntry(options.key, cache);
  }
}
