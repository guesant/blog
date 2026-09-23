import { listPublicContent } from '../api/public-site-generated-list-public-content';
import { apiClient } from '../api/public-site-source-api-client';
import { feedItem } from '../api/public-site-source-feed-item';
import { objectValue } from '../api/public-site-source-object-value';
import { recordList } from '../api/public-site-source-list';
import { publicCollectionMeta } from '../api/public-site-source-public-collection-meta';
import { normalizeLocale } from '../api/public-site-source-normalize-locale';
import type {
  ContentCollectionMeta,
  ContentCollectionQuery,
} from '../api/public-site-source-support';
import type { PublicFeedItem } from '../domain/types';

export type HomeFeedPage = {
  items: PublicFeedItem[];
  meta: ContentCollectionMeta;
};

export async function getHomeFeedPage(
  locale?: string,
  query?: ContentCollectionQuery,
): Promise<HomeFeedPage> {
  const feedQuery = query ?? {};

  const result = await listPublicContent({
    client: apiClient(),
    path: { collection: 'feed' },
    query: {
      locale,
      page: feedQuery.page,
      per_page: feedQuery.perPage,
      sort: feedQuery.sort,
      q: feedQuery.q,
      type: feedQuery.type,
      topic: feedQuery.topic,
      kind: feedQuery.kind,
    },
  });

  const payload = objectValue(result.data);

  const items = recordList<Record<string, unknown>>(payload?.data).map(feedItem);

  return {
    items,
    meta: publicCollectionMeta({
      value: objectValue(payload?.meta),
      query: feedQuery,
      locale: normalizeLocale(locale),
    }),
  };
}
