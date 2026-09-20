import { featureFlags } from '../config/feature-flags';
import { routeLoaders } from './content-data-route-loaders';
import { statusData } from './content-data-status-data';
import type { RouteData, RouteRequest } from './content-data-support';

export async function loadRouteData(data: RouteRequest): Promise<RouteData> {
  const loader = routeLoaders[data.pathname];

  if (loader) {
    return loader(data);
  }
  if (featureFlags.tools && data.pathname.startsWith('/tools/')) {
    return { kind: 'tool', slug: data.pathname.slice('/tools/'.length) };
  }
  return statusData(data.locale, 'notFound');
}
