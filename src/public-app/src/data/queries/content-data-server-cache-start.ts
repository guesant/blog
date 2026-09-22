import { getServerCacheEntry } from './content-data-server-cache-entry';
import { settleServerCacheRequest } from './content-data-server-cache-settle';
import type {
  ServerCache,
  ServerCacheEntry,
  ServerStaleWhileRevalidateOptions,
} from './content-data-server-cache-types';

export function startServerCacheRequest<T>(
  options: ServerStaleWhileRevalidateOptions<T>,
  cache: ServerCache<T>,
  current?: ServerCacheEntry<T>,
): Promise<T> | T {
  const now = Date.now();

  const entry = getServerCacheEntry(current, now);

  const promise = options.loader();

  entry.promise = promise;
  entry.lastAccessAt = now;
  cache.set(options.key, entry);
  settleServerCacheRequest({ options, cache, entry, promise });

  if (entry.value !== undefined) {
    return entry.value;
  }

  return promise.catch(() => options.fallback);
}
