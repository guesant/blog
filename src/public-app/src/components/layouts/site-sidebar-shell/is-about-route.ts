import { routeSegment } from './route-segment';

export function isAboutRoute(route: string) {
  return ['about', 'now', 'portfolio', 'cases', 'projects', 'resume'].includes(routeSegment(route));
}
