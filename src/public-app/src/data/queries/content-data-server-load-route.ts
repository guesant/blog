import { withPublicSiteSnapshot } from '@portfolio/data/services';
import { loadRouteData } from './content-data-load-route-data';
import type { RouteData, RouteRequest } from './content-data-support';

export async function loadRouteDataWithSnapshot(data: RouteRequest): Promise<RouteData> {
  return withPublicSiteSnapshot(data.locale, () => loadRouteData(data));
}
