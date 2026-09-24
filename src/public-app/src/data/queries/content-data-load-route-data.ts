import { routeLoaders } from './content-data-route-loaders';
import { statusData } from './content-data-status-data';
import type { RouteData, RouteRequest } from './content-data-support';
import type { RouteLoadContext } from './content-data-route-loader';

export async function loadRouteData(
  data: RouteRequest,
  context?: RouteLoadContext,
): Promise<RouteData> {
  const loader = routeLoaders[data.pathname];

  if (loader) {
    return loader(data, context);
  }
  return statusData(data.locale, 'notFound');
}
