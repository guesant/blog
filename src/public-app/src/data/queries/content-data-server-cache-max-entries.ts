import type { ServerStaleWhileRevalidateOptions } from './content-data-server-cache-types';

export function getServerCacheMaxEntries<T>(options: ServerStaleWhileRevalidateOptions<T>): number {
  if (options.maxEntries !== undefined) {
    return options.maxEntries;
  }

  return 64;
}
