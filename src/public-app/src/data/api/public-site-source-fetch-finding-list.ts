import { listFindings } from './generated/index.ts';
import type { ContentLocale, FindingList, FindingListQuery } from './public-site-source-support';
import { apiClient } from './public-site-source-api-client';
import { objectValue } from './public-site-source-object-value';
import { reference } from './public-site-source-reference';
import { findingListItems } from './public-site-source-finding-list-items';
import { findingListMeta } from './public-site-source-finding-list-meta';

export async function fetchFindingList(
  filters: FindingListQuery,
  locale: ContentLocale,
): Promise<FindingList> {
  const result = await listFindings({
    client: apiClient(),
    query: {
      locale,
      q: filters.q,
      type: filters.type,
      topic: filters.topic,
      rating: filters.rating,
      consumption_state: filters.consumptionState,
      year: filters.year,
      free_only: filters.freeOnly,
      sort: filters.sort,
      page: filters.page,
      per_page: filters.perPage,
    },
  });

  const payload = objectValue(result.data);

  const meta = objectValue(payload?.meta);

  return {
    items: findingListItems(payload?.data).map(reference),
    meta: findingListMeta(meta, filters, locale),
  };
}
