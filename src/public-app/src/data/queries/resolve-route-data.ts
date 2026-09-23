import { resolveRouteDataValue } from './resolve-route-data-value';
import type { RouteData } from './content-data-route-data';

type ResolveRouteDataProps = {
  queryData?: RouteData;
  loaderData?: RouteData;
  queryHasError: boolean;
};

export function resolveRouteData(props: ResolveRouteDataProps): RouteData {
  return resolveRouteDataValue(props);
}
