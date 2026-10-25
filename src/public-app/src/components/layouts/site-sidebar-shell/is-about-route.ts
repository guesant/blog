import { routeSegment } from '../../navigation/route-segment';

export function isAboutRoute(route: string) {
  return ['about', 'now'].includes(routeSegment(route));
}
