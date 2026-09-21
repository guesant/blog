import { queryOptions } from '@tanstack/react-query';
import {
  listFindingsOptions,
  type ListFindingsResponse,
} from '@portfolio/data/api/public-site-generated-client';
import { apiClient } from '@portfolio/data/api/public-site-source-api-client';
import type { ContentLocale, FindingList } from '@portfolio/data/api/public-site-source-support';
import { findingListItems } from '@portfolio/data/api/public-site-source-finding-list-items';
import { findingListMeta } from '@portfolio/data/api/public-site-source-finding-list-meta';
import { objectValue } from '@portfolio/data/api/public-site-source-object-value';
import { reference } from '@portfolio/data/api/public-site-source-reference';
import { findingFilters } from './content-data-finding-filters';

export type FindingsQueryOptionsInput = {
  locale: ContentLocale;
  search?: string;
};

export function findingsQueryOptions(props: FindingsQueryOptionsInput) {
  const filters = findingFilters(props.search);

  const options = listFindingsOptions({
    client: apiClient(),
    query: {
      locale: props.locale,
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

  return queryOptions({
    ...options,
    select: (response: ListFindingsResponse): FindingList => ({
      items: findingListItems(response.data).map(reference),
      meta: findingListMeta(objectValue(response.meta), filters, props.locale),
    }),
  });
}
