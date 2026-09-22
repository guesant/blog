import { removeServerCacheEntry } from './content-data-server-cache-remove';
import { updateServerCache } from './content-data-server-cache-update';
import type {
  ServerCache,
  ServerCacheEntry,
  ServerStaleWhileRevalidateOptions,
} from './content-data-server-cache-types';

type ServerCacheSettlementOptions<T> = {
  options: ServerStaleWhileRevalidateOptions<T>;
  cache: ServerCache<T>;
  entry: ServerCacheEntry<T>;
  promise: Promise<T>;
};

export function settleServerCacheRequest<T>(props: ServerCacheSettlementOptions<T>): void {
  void props.promise.then(
    (value) =>
      updateServerCache({
        options: props.options,
        cache: props.cache,
        entry: props.entry,
        value,
      }),
    () => removeServerCacheEntry(props.options, props.cache, props.entry),
  );
}
