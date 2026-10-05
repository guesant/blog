import type { ContentCollectionPage, ContentCollectionQuery } from './public-site-source-support';
import { PUBLIC_CONTENT_PAGE_SIZE } from '../public-content-page-size';
import { getFeedPage } from './public-site-source-get-feed-page';

export async function getFindingCollectionPage<T>(
  query: ContentCollectionQuery,
  locale: 'en' | 'pt-BR',
): Promise<ContentCollectionPage<T>> {
  const result = await getFeedPage(locale, {
    page: query.page ?? 1,
    perPage: PUBLIC_CONTENT_PAGE_SIZE,
    sort: query.sort,
    q: query.q,
    type: query.type,
    topic: query.topic,
    kind: 'achado',
  });

  return {
    items: result.items.map((item) => item.reference).filter(Boolean) as T[],
    meta: {
      ...result.meta,
    },
  };
}
