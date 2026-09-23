import { useQuery } from '@tanstack/react-query';
import { useLocation } from '@tanstack/react-router';
import { errorRouteData, fallbackRouteData, routeQueryOptions } from '../../data/queries';
import type { RouteData } from '../../data/queries';
import { RouteView } from '../../route-view';
import { requestForPath } from './splat-request-for-path';

type SplatRouteProps = { initialData: RouteData };

export function SplatRoute(props: SplatRouteProps) {
  const location = useLocation();

  const request = requestForPath(location.pathname, location.searchStr);

  const routeQuery = useQuery(routeQueryOptions(request));

  const data =
    routeQuery.data ??
    props.initialData ??
    (routeQuery.isError ? errorRouteData : fallbackRouteData);

  return <RouteView data={data} />;
}
