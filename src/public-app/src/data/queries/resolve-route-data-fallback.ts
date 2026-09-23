import { errorRouteData } from './content-data-fallback-route';
import { resolveRouteDataFromSources } from './resolve-route-data-from-sources';
import type { RouteData } from './content-data-route-data';

type ResolveRouteDataFallbackProps = {
  queryData?: RouteData;
  loaderData?: RouteData;
  queryHasError: boolean;
};

export function resolveRouteDataFallback(props: ResolveRouteDataFallbackProps): RouteData {
  if (props.queryHasError) {
    return errorRouteData;
  }

  return resolveRouteDataFromSources(props);
}
