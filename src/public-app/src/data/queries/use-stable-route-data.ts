import { useRef } from 'react';
import { resolveRouteData } from './resolve-route-data';
import type { RouteData } from './content-data-route-data';
import { useRouteViewState } from './use-route-view-state';
import { resolveStableRouteData } from './resolve-stable-route-data';

type UseStableRouteDataProps = {
  queryData?: RouteData;
  loaderData?: RouteData;
  queryHasError: boolean;
};

export function useStableRouteData(props: UseStableRouteDataProps): RouteData {
  const resolved = resolveRouteData(props);

  const previous = useRef<RouteData | undefined>(undefined);

  const sharedState = useRouteViewState();

  if (resolved.kind !== 'loading') {
    previous.current = resolved;
    if (sharedState) {
      sharedState.previousData = resolved;
    }
  }

  return resolveStableRouteData({ resolved, previous: previous.current, sharedState });
}
