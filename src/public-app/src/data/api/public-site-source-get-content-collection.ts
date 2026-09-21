import {
  ContentCollection,
  ContentCollectionPage,
  ContentCollectionQuery,
} from './public-site-source-support';
import { normalizeLocale } from './public-site-source-normalize-locale';
import { getFindingCollectionPage } from './public-site-source-get-finding-collection-page';
import { getPublicCollectionPage } from './public-site-source-get-public-collection-page';

export async function getContentCollectionPage<T>(
  collection: ContentCollection,
  locale?: string,
  query: ContentCollectionQuery = {},
): Promise<ContentCollectionPage<T>> {
  const language = normalizeLocale(locale);

  if (collection === 'references') return getFindingCollectionPage<T>(query, language);

  return getPublicCollectionPage<T>(
    collection as Exclude<ContentCollection, 'references'>,
    language,
    query,
  );
}
