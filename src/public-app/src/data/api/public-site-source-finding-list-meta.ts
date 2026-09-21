import type {
  ContentLocale,
  FindingListMeta,
  FindingListQuery,
  RecordValue,
} from './public-site-source-support';
import { findingFacets } from './public-site-source-finding-facets';
import { findingListMetaNumbers } from './public-site-source-finding-list-meta-numbers';

export function findingListMeta(
  value: RecordValue | undefined,
  filters: FindingListQuery,
  locale: ContentLocale,
): FindingListMeta {
  const numbers = findingListMetaNumbers(value, filters);

  return {
    ...numbers,
    locale,
    facets: findingFacets(value?.facets),
  };
}
