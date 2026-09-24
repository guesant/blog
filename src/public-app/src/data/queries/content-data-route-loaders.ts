import { detailRouteLoaders } from './content-data-detail-route-loaders';
import { primaryRouteLoaders } from './content-data-primary-route-loaders';
import type { RouteLoader } from './content-data-route-loader';

export const routeLoaders: Record<string, RouteLoader> = {
  ...primaryRouteLoaders,
  ...detailRouteLoaders,
};
