import type { ContentLocale, FindingListQuery } from './public-site-source-support';

export type FindingApiQueryProps = {
  locale: ContentLocale;
  filters: FindingListQuery;
};

export function findingApiQuery(props: FindingApiQueryProps) {
  return {
    locale: props.locale,
    q: props.filters.q,
    type: props.filters.type,
    topic: props.filters.topic,
    rating: props.filters.rating,
    consumption_state: props.filters.consumptionState,
    year: props.filters.year,
    free_only: props.filters.freeOnly,
    sort: props.filters.sort,
    page: props.filters.page,
    per_page: props.filters.perPage,
  };
}
