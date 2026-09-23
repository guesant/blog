import type { RouteData } from './content-data-route-data';
import type { RouteViewState } from './route-view-state-context';

type ResolveStableRouteDataProps = {
  resolved: RouteData;
  previous?: RouteData;
  sharedState?: RouteViewState;
};

export function resolveStableRouteData(props: ResolveStableRouteDataProps): RouteData {
  if (props.resolved.kind !== 'loading') {
    return props.resolved;
  }

  if (props.previous) {
    return props.previous;
  }

  if (props.sharedState?.previousData) {
    return props.sharedState.previousData;
  }

  return props.resolved;
}
