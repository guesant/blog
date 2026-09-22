import { loadRouteData } from './content-data-load-route-data';
import type { RouteData, RouteRequest } from './content-data-support';

export async function loadRouteDataForRequest(data: RouteRequest): Promise<RouteData> {
  return loadRouteData(data);
}
