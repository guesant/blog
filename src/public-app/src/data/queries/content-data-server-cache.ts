import { readPendingOrStartServerCache } from './content-data-server-cache-pending';
import { readFreshServerCache } from './content-data-server-cache-read';
import type {
  ServerCache,
  ServerCacheEntry,
  ServerStaleWhileRevalidateOptions,
} from './content-data-server-cache-types';

const serverCache: ServerCache<unknown> = new Map();

export async function getServerStaleWhileRevalidate<T>(
  options: ServerStaleWhileRevalidateOptions<T>,
): Promise<T> {
  const current = serverCache.get(options.key) as ServerCacheEntry<T> | undefined;

  const fresh = readFreshServerCache(current, Date.now());

  if (fresh !== undefined) {
    return fresh;
  }

  return readPendingOrStartServerCache({
    options,
    cache: serverCache as ServerCache<T>,
    current,
  });
}
