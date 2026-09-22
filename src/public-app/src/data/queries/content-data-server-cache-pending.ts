import { startServerCacheRequest } from './content-data-server-cache-start';
import type {
  ServerCache,
  ServerCacheEntry,
  ServerStaleWhileRevalidateOptions,
} from './content-data-server-cache-types';

type PendingServerCacheOptions<T> = {
  options: ServerStaleWhileRevalidateOptions<T>;
  cache: ServerCache<T>;
  current?: ServerCacheEntry<T>;
};

export function readPendingOrStartServerCache<T>(
  props: PendingServerCacheOptions<T>,
): Promise<T> | T {
  if (props.current?.promise) {
    if (props.current.value !== undefined) {
      return props.current.value;
    }

    return props.current.promise.catch(() => props.options.fallback);
  }

  return startServerCacheRequest(props.options, props.cache, props.current);
}
