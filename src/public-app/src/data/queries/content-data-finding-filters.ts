import type { FindingListQuery } from '@portfolio/data/services';
import { optionalQueryParam } from './optional-query-param';
import { parseFindingSort } from './parse-finding-sort';
import { positiveQueryNumber } from './positive-query-number';

export function findingFilters(search: string | undefined): FindingListQuery {
  const params = new URLSearchParams(search);

  const page = positiveQueryNumber(params.get('page'));

  const year = positiveQueryNumber(params.get('year'));

  return {
    q: optionalQueryParam(params, 'q'),
    type: optionalQueryParam(params, 'type'),
    topic: optionalQueryParam(params, 'topic'),
    rating: optionalQueryParam(params, 'rating'),
    consumptionState: optionalQueryParam(params, 'consumption_state'),
    year,
    sort: parseFindingSort(params.get('sort')),
    page: page ?? 1,
    perPage: 20,
  };
}
