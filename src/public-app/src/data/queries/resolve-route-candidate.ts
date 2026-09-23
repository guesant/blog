import type { RouteData } from './content-data-route-data';

export function resolveRouteCandidate(candidate?: RouteData): RouteData | undefined {
  if (!candidate || candidate.kind === 'loading') {
    return undefined;
  }

  return candidate;
}
