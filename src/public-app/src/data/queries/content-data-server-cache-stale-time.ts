import type { ServerStaleWhileRevalidateOptions } from './content-data-server-cache-types';

export function getServerCacheStaleTime<T>(options: ServerStaleWhileRevalidateOptions<T>): number {
  if (options.staleTimeMs !== undefined) {
    return options.staleTimeMs;
  }

  return 30_000;
}
