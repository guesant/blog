import type { RouteData } from './content-data-route-data';

export const fallbackRouteData: RouteData = {
  kind: 'loading',
};

export const errorRouteData: RouteData = {
  kind: 'status',
  status: 'error',
};
