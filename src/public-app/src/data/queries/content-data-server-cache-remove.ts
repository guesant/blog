import type {
  ServerCache,
  ServerCacheEntry,
  ServerStaleWhileRevalidateOptions,
} from './content-data-server-cache-types';

export function removeServerCacheEntry<T>(
  options: ServerStaleWhileRevalidateOptions<T>,
  cache: ServerCache<T>,
  entry: ServerCacheEntry<T>,
): void {
  if (cache.get(options.key) === entry) {
    cache.delete(options.key);
  }
}
