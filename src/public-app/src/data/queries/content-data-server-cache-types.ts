export type ServerCacheEntry<T> = {
  value?: T;
  expiresAt: number;
  lastAccessAt: number;
  promise?: Promise<T>;
};

export type ServerCache<T> = Map<string, ServerCacheEntry<T>>;

export type ServerStaleWhileRevalidateOptions<T> = {
  key: string;
  loader: () => Promise<T>;
  fallback: T;
  staleTimeMs?: number;
  maxEntries?: number;
};

export type ServerCacheUpdateOptions<T> = {
  options: ServerStaleWhileRevalidateOptions<T>;
  cache: ServerCache<T>;
  entry: ServerCacheEntry<T>;
  value: T;
};
