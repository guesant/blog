import { getContentCollectionPage } from '../api/public-site-source.ts';
import type {
  ContentCollection,
  ContentCollectionPage,
  ContentCollectionQuery,
} from '../api/public-site-source-support';

export function getCollectionPage<T>(
  collection: ContentCollection,
  locale?: string,
  query?: ContentCollectionQuery,
): Promise<ContentCollectionPage<T>> {
  return getContentCollectionPage<T>(collection, locale, query);
}
