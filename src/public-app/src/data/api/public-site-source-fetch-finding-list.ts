import { listFindings } from './public-site-generated-client';
import type { ContentLocale, FindingList, FindingListQuery } from './public-site-source-support';
import { apiClient } from './public-site-source-api-client';
import { objectValue } from './public-site-source-object-value';
import { reference } from './public-site-source-reference';
import { findingListItems } from './public-site-source-finding-list-items';
import { findingListMeta } from './public-site-source-finding-list-meta';
import { findingApiQuery } from './public-site-source-finding-api-query';

export async function fetchFindingList(
  filters: FindingListQuery,
  locale: ContentLocale,
): Promise<FindingList> {
  const result = await listFindings({
    client: apiClient(),
    throwOnError: true,
    query: findingApiQuery({ locale, filters }),
  });

  if (!result.data) {
    throw new Error('Public site API returned an empty findings response');
  }

  const payload = objectValue(result.data);

  const meta = objectValue(payload?.meta);

  return {
    items: findingListItems(payload?.data).map(reference),
    meta: findingListMeta(meta, filters, locale),
  };
}
