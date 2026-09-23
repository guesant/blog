import { fallbackRouteData } from './content-data-fallback-route';
import type { RouteData } from './content-data-route-data';

type ResolveRouteDataFromSourcesProps = {
  queryData?: RouteData;
  loaderData?: RouteData;
};

export function resolveRouteDataFromSources(props: ResolveRouteDataFromSourcesProps): RouteData {
  if (props.queryData) {
    return props.queryData;
  }

  if (props.loaderData) {
    return props.loaderData;
  }

  return fallbackRouteData;
}
