import type { ContentCollectionQuery } from '../api/public-site-source-support';
import { PUBLIC_HOME_FEED_PAGE_SIZE } from '../public-content-page-size';
import { collectionQuery } from './content-data-collection-query';

export function homeFeedQuery(search: string | undefined): ContentCollectionQuery {
  return collectionQuery(search, 'page', PUBLIC_HOME_FEED_PAGE_SIZE);
}
