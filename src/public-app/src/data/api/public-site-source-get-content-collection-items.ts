import type { ContentCollection, ContentCollectionQuery } from './public-site-source-support';
import { getContentCollectionPage } from './public-site-source-get-content-collection';

export async function getContentCollection<T>(
  collection: ContentCollection,
  locale?: string,
  query: ContentCollectionQuery = {},
): Promise<T[]> {
  return (await getContentCollectionPage<T>(collection, locale, query)).items;
}
