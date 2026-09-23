import type { ContentCollectionQuery } from '../api/public-site-source-support';
import { contentCollectionQueryKind } from './content-collection-query-kind';
import { contentCollectionQueryString } from './content-collection-query-string';
import { contentCollectionQuerySort } from './content-collection-query-sort';
import { positiveQueryNumber } from './positive-query-number';

export function collectionQuery(
  search: string | undefined,
  parameter = 'page',
  perPage = 20,
): ContentCollectionQuery {
  const params = new URLSearchParams(search);

  const page = positiveQueryNumber(params.get(parameter));

  const sort = params.get('sort');

  const query = params.get('q');

  const type = params.get('type');

  const topic = params.get('topic');

  return {
    page: page ?? 1,
    perPage,
    q: contentCollectionQueryString(query),
    type: contentCollectionQueryString(type),
    topic: contentCollectionQueryString(topic),
    kind: contentCollectionQueryKind(params.get('kind')),
    sort: contentCollectionQuerySort(sort),
  };
}
