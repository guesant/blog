import { getCollectionsPageCopy, getFeedPage } from '@portfolio/data/services';
import type { RouteRequest } from './content-data-support';
import type { RouteData } from './content-data-route-data';
import { collectionQuery } from './content-data-collection-query';

export type CollectionsRouteLoaderProps = Pick<RouteRequest, 'locale' | 'search'>;

export async function collectionsRouteLoader(
  props: CollectionsRouteLoaderProps,
): Promise<Extract<RouteData, { kind: 'collections' }>> {
  const result = await getFeedPage(props.locale, {
    ...collectionQuery(props.search),
    kind: 'colecao',
  });

  return {
    kind: 'collections',
    page: await getCollectionsPageCopy(props.locale),
    feedItems: result.items,
    feedPagination: result.meta,
  };
}
