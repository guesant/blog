import type {
  ContentLocale,
  FindingListMeta,
  FindingListQuery,
  RecordValue,
} from './public-site-source-support';
import { fallbackValue } from './public-site-source-fallback';
import { findingFacets } from './public-site-source-finding-facets';
import { numberValue } from './public-site-source-number-value';

export function findingListMeta(
  value: RecordValue | undefined,
  filters: FindingListQuery,
  locale: ContentLocale,
): FindingListMeta {
  return {
    page: Number(fallbackValue(numberValue(value?.page), fallbackValue(filters.page, 1))),
    perPage: Number(
      fallbackValue(numberValue(value?.per_page), fallbackValue(filters.perPage, 20)),
    ),
    total: Number(fallbackValue(numberValue(value?.total), 0)),
    locale,
    facets: findingFacets(value?.facets),
  };
}
