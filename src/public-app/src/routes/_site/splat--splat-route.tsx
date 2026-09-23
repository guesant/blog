import { useQuery } from '@tanstack/react-query';
import { useLocation } from '@tanstack/react-router';
import { routeQueryOptions, useStableRouteData } from '../../data/queries';
import type { RouteData } from '../../data/queries';
import { RouteView } from '../../route-view';
import { requestForPath } from './splat-request-for-path';

type SplatRouteProps = { initialData: RouteData };

export function SplatRoute(props: SplatRouteProps) {
  const location = useLocation();

  const request = requestForPath(location.pathname, location.searchStr);

  const routeQuery = useQuery(routeQueryOptions(request));

  const data = useStableRouteData({
    queryData: routeQuery.data,
    loaderData: props.initialData,
    queryHasError: routeQuery.isError,
  });

  return <RouteView data={data} />;
}
