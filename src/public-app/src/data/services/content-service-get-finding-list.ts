import { normalizeLocale, fetchFindingList } from '../api/public-site-source.ts';

export function getFindingList(
  filters: import('../api/public-site-source.ts').FindingListQuery = {},
  locale?: string,
) {
  return fetchFindingList(filters, normalizeLocale(locale));
}
