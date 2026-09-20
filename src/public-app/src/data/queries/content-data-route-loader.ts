import type { RouteData, RouteRequest } from './content-data-support';

export type RouteLoader = (data: RouteRequest) => Promise<RouteData>;
