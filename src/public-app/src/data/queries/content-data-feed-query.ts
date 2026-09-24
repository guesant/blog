import type { ContentCollectionQuery } from '../api/public-site-source-support';
import { collectionQuery } from './content-data-collection-query';
import { feedPerPage } from './content-data-feed-per-page';

export function feedQuery(search: string | undefined): ContentCollectionQuery {
  const params = new URLSearchParams(search);

  const perPage = feedPerPage(params.get('per_page'));

  return collectionQuery(search, 'page', perPage);
}
