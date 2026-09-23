import type { QueryClient } from '@tanstack/react-query';
import type { RouteRequest } from '../data/queries';
import {
  errorRouteData,
  fallbackRouteData,
  getSsrQueryData,
  routeQueryOptions,
  SSR_CONTENT_BUDGET_MS,
} from '../data/queries';

export type SiteRouteLoaderProps = {
  queryClient: QueryClient;
  request: RouteRequest;
};

export function siteRouteLoader(props: SiteRouteLoaderProps) {
  return getSsrQueryData({
    queryClient: props.queryClient,
    options: routeQueryOptions(props.request),
    fallback: fallbackRouteData,
    errorFallback: errorRouteData,
    timeoutMs: SSR_CONTENT_BUDGET_MS,
  });
}
