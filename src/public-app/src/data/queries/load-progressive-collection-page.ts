import { getContentCollectionPage } from '../api/public-site-source';
import type {
  ContentCollection,
  ContentCollectionPage,
  ContentCollectionQuery,
} from '../api/public-site-source-support';

export function createProgressiveCollectionLoader<T>(
  collection: Exclude<ContentCollection, 'references'>,
  locale: string,
  query: ContentCollectionQuery,
): (page: number) => Promise<ContentCollectionPage<T>> {
  return (page) =>
    getContentCollectionPage<T>(collection, locale, {
      ...query,
      page,
    });
}
