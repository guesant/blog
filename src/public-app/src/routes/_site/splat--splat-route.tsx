import { useSuspenseQuery } from '@tanstack/react-query';
import { useLocation } from '@tanstack/react-router';
import { routeQueryOptions } from '../../data/queries';
import { RouteView } from '../../route-view';
import { requestForPath } from './splat-request-for-path';

export function SplatRoute() {
  const location = useLocation();

  const request = requestForPath(location.pathname, location.searchStr);

  const data = useSuspenseQuery(routeQueryOptions(request)).data;

  return <RouteView data={data} />;
}
