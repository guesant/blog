import type { ContentCollectionQuery } from '../api/public-site-source-support';
import { positiveQueryNumber } from './positive-query-number';

export function collectionQuery(
  search: string | undefined,
  parameter = 'page',
  perPage = 20,
): ContentCollectionQuery {
  const params = new URLSearchParams(search);

  const page = positiveQueryNumber(params.get(parameter));

  return { page: page ?? 1, perPage };
}
