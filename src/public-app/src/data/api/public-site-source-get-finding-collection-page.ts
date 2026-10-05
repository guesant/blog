import type { ContentCollectionPage, ContentCollectionQuery } from './public-site-source-support';
import { fetchFindingList } from './public-site-source-fetch-finding-list';
import { PUBLIC_CONTENT_PAGE_SIZE } from '../public-content-page-size';

export async function getFindingCollectionPage<T>(
  query: ContentCollectionQuery,
  locale: 'en' | 'pt-BR',
): Promise<ContentCollectionPage<T>> {
  const result = await fetchFindingList(
    {
      page: query.page ?? 1,
      perPage: PUBLIC_CONTENT_PAGE_SIZE,
      sort: query.sort,
      q: query.q,
      type: query.type,
      topic: query.topic,
    },
    locale,
  );

  return {
    items: result.items as T[],
    meta: {
      page: result.meta.page,
      perPage: result.meta.perPage,
      total: result.meta.total,
      lastPage: result.meta.lastPage,
      locale: result.meta.locale,
    },
  };
}
