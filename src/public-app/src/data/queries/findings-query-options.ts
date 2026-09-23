import { queryOptions } from '@tanstack/react-query';
import { listFindingsOptions } from '@portfolio/data/api/public-site-generated-client';
import { apiClient } from '@portfolio/data/api/public-site-source-api-client';
import { findingApiQuery } from '@portfolio/data/api/public-site-source-finding-api-query';
import type { ContentLocale } from '@portfolio/data/api/public-site-source-support';
import { fetchFindingList } from '@portfolio/data/api/public-site-source-fetch-finding-list';
import { findingFilters } from './content-data-finding-filters';

export type FindingsQueryOptionsInput = {
  locale: ContentLocale;
  search?: string;
};

export function findingsQueryOptions(props: FindingsQueryOptionsInput) {
  const filters = findingFilters(props.search);

  const options = listFindingsOptions({
    client: apiClient(),
    query: findingApiQuery({ locale: props.locale, filters }),
  });

  return queryOptions({
    queryKey: options.queryKey,
    queryFn: () => fetchFindingList(filters, props.locale),
  });
}
