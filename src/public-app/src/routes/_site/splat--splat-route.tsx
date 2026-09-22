import { useQuery } from '@tanstack/react-query';
import { useLocation } from '@tanstack/react-router';
import { fallbackRouteData, routeQueryOptions } from '../../data/queries';
import { RouteView } from '../../route-view';
import { requestForPath } from './splat-request-for-path';

export function SplatRoute() {
  const location = useLocation();

  const request = requestForPath(location.pathname, location.searchStr);

  const data = useQuery(routeQueryOptions(request)).data ?? fallbackRouteData;

  return <RouteView data={data} />;
}
