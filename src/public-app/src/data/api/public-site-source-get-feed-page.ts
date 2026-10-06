import { listPublicFeed } from './public-site-generated-list-feed';
import { apiClient } from './public-site-source-api-client';
import { feedItem } from './public-site-source-feed-item';
import { objectValue } from './public-site-source-object-value';
import { recordList } from './public-site-source-list';
import { publicCollectionMeta } from './public-site-source-public-collection-meta';
import { normalizeLocale } from './public-site-source-normalize-locale';
import { PUBLIC_CONTENT_PAGE_SIZE } from '../public-content-page-size';
import { fallbackValue } from './public-site-source-fallback';
import type { ContentCollectionMeta, ContentCollectionQuery } from './public-site-source-support';
import type { PublicFeedItem } from '../domain/types';

export type FeedPage = {
  items: PublicFeedItem[];
  meta: ContentCollectionMeta;
};

export async function getFeedPage(
  locale?: string,
  query: ContentCollectionQuery = {},
): Promise<FeedPage> {
  const result = await listPublicFeed({
    client: apiClient(),
    throwOnError: true,
    query: {
      locale,
      page: query.page,
      per_page: fallbackValue(query.perPage, PUBLIC_CONTENT_PAGE_SIZE),
      sort: query.sort,
      q: query.q,
      type: query.type,
      topic: query.topic,
      kind: query.kind,
    },
  });

  if (!result.data) {
    throw new Error('Public site API returned an empty feed response');
  }

  const payload = objectValue(result.data);

  return {
    items: recordList<Record<string, unknown>>(payload?.data).map(feedItem),
    meta: publicCollectionMeta({
      value: objectValue(payload?.meta),
      query,
      locale: normalizeLocale(locale),
    }),
  };
}
