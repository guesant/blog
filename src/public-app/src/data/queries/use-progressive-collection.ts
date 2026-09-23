'use client';

import type {
  ContentCollection,
  ContentCollectionPage,
  ContentCollectionQuery,
} from '../api/public-site-source-support';
import { useLocale } from '@/i18n/compat';
import { createProgressiveCollectionLoader } from './load-progressive-collection-page';
import { useProgressiveContent } from './use-progressive-content';
import type { ProgressiveContentQuery } from './progressive-content-types';

type UseProgressiveCollectionProps<T> = {
  collection: Exclude<ContentCollection, 'references'>;
  query: ContentCollectionQuery;
  initialPage: ContentCollectionPage<T>;
  queryKey: readonly unknown[];
  getKey: (item: T) => string;
};

export function useProgressiveCollection<T>(props: UseProgressiveCollectionProps<T>) {
  const locale = useLocale();

  const progressiveQuery: ProgressiveContentQuery<T> = {
    initialPage: props.initialPage,
    queryKey: ['collection', locale, ...props.queryKey],
    getKey: props.getKey,
    loadPage: createProgressiveCollectionLoader<T>(props.collection, locale, props.query),
  };

  return useProgressiveContent(progressiveQuery);
}
