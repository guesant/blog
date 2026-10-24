import {
  ContentCollection,
  ContentCollectionPage,
  ContentCollectionQuery,
} from './public-site-source-support';
import { normalizeLocale } from './public-site-source-normalize-locale';
import { getPublicCollectionPage } from './public-site-source-get-public-collection-page';

export async function getContentCollectionPage<T>(
  collection: ContentCollection,
  locale?: string,
  query: ContentCollectionQuery = {},
): Promise<ContentCollectionPage<T>> {
  const language = normalizeLocale(locale);

  return getPublicCollectionPage<T>(collection, language, query);
}
