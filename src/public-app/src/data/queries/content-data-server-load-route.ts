import { loadRouteData } from './content-data-load-route-data';
import type { RouteData, RouteRequest } from './content-data-support';
import type { RouteLoadContext } from './content-data-route-loader';

export async function loadRouteDataForRequest(
  data: RouteRequest,
  context?: RouteLoadContext,
): Promise<RouteData> {
  return loadRouteData(data, context);
}
