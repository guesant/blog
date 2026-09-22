import type { ContentLocale, FindingList } from '@portfolio/data/api/public-site-source-support';

export function emptyFindingList(locale: ContentLocale): FindingList {
  return {
    items: [],
    meta: {
      page: 1,
      perPage: 20,
      total: 0,
      lastPage: 1,
      locale,
      facets: { types: [], ratings: [], consumptionStates: [], years: [], topics: [] },
    },
  };
}
