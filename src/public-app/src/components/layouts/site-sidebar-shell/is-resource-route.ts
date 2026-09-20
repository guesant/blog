import { routeSegment } from './route-segment';

export function isResourceRoute(route: string) {
  return ['feed.xml', 'feed.json'].includes(routeSegment(route));
}
