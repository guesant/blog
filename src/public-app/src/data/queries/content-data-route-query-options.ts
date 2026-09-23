import { queryOptions } from '@tanstack/react-query';
import { RouteData, RouteRequest, loadRoute } from './content-data-support';

export const routeQueryOptions = (request: RouteRequest) =>
  queryOptions<RouteData>({
    queryKey: [
      'route',
      request.locale,
      request.pathname,
      request.slug,
      request.type,
      request.search,
    ],
    enabled: typeof window !== 'undefined',
    queryFn: async () => (await loadRoute({ data: request })) as RouteData,
  });
