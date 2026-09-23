import { listPublicContent } from './public-site-generated-client';
import type {
  ContentCollection,
  ContentCollectionPage,
  ContentCollectionQuery,
} from './public-site-source-support';
import { apiClient } from './public-site-source-api-client';
import { objectValue } from './public-site-source-object-value';
import { publicCollectionItems } from './public-site-source-public-collection-items';
import { publicCollectionMeta } from './public-site-source-public-collection-meta';

export async function getPublicCollectionPage<T>(
  collection: Exclude<ContentCollection, 'references'>,
  locale: 'en' | 'pt-BR',
  query: ContentCollectionQuery,
): Promise<ContentCollectionPage<T>> {
  const result = await listPublicContent({
    client: apiClient(),
    throwOnError: true,
    path: { collection },
    query: {
      locale,
      page: query.page,
      per_page: query.perPage,
      sort: query.sort,
      featured: query.featured,
      q: query.q,
      type: query.type,
      topic: query.topic,
    },
  });

  if (!result.data) {
    throw new Error('Public site API returned an empty collection response');
  }

  const payload = objectValue(result.data);

  return {
    items: publicCollectionItems<T>(collection, payload?.data),
    meta: publicCollectionMeta({
      value: objectValue(payload?.meta),
      query,
      locale,
    }),
    groups: objectValue(payload?.groups),
  };
}
