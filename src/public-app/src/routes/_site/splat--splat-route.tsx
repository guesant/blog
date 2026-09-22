import { useQuery } from '@tanstack/react-query';
import { useLocation } from '@tanstack/react-router';
import { errorRouteData, fallbackRouteData, routeQueryOptions } from '../../data/queries';
import { RouteView } from '../../route-view';
import { requestForPath } from './splat-request-for-path';

export function SplatRoute() {
  const location = useLocation();

  const request = requestForPath(location.pathname, location.searchStr);

  const routeQuery = useQuery(routeQueryOptions(request));

  const data = routeQuery.data ?? (routeQuery.isError ? errorRouteData : fallbackRouteData);

  return <RouteView data={data} />;
}
