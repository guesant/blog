import { resolveRouteDataFallback } from './resolve-route-data-fallback';
import { resolveRouteCandidate } from './resolve-route-candidate';
import type { RouteData } from './content-data-route-data';

type ResolveRouteDataValueProps = {
  queryData?: RouteData;
  loaderData?: RouteData;
  queryHasError: boolean;
};

export function resolveRouteDataValue(props: ResolveRouteDataValueProps): RouteData {
  const routeData =
    resolveRouteCandidate(props.queryData) ?? resolveRouteCandidate(props.loaderData);

  return routeData ?? resolveRouteDataFallback(props);
}
