import type { ContentCollectionMeta } from '../api/public-site-source-support';

export type ProgressiveContentPage<T> = {
  items: T[];
  meta: ContentCollectionMeta;
};

export type ProgressiveContentQuery<T> = {
  enabled?: boolean;
  initialPage: ProgressiveContentPage<T>;
  queryKey: readonly unknown[];
  loadPage: (page: number) => Promise<ProgressiveContentPage<T>>;
  getKey: (item: T) => string;
};
