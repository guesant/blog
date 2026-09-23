import { getCollectionPage, getCollectionsPageCopy } from '@portfolio/data/services';
import type { ReferenceCollection } from '@portfolio/data/domain/types';
import type { RouteRequest } from './content-data-support';
import type { RouteData } from './content-data-route-data';
import { collectionQuery } from './content-data-collection-query';

export type CollectionsRouteLoaderProps = Pick<RouteRequest, 'locale' | 'search'>;

export async function collectionsRouteLoader(
  props: CollectionsRouteLoaderProps,
): Promise<Extract<RouteData, { kind: 'collections' }>> {
  const result = await getCollectionPage<ReferenceCollection>(
    'collections',
    props.locale,
    collectionQuery(props.search),
  );

  return {
    kind: 'collections',
    page: await getCollectionsPageCopy(props.locale),
    writings: [],
    findings: [],
    collections: result.items,
    pagination: result.meta,
  };
}
