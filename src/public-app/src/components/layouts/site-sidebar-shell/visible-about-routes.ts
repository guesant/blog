import { aboutRoutes } from './types';
import type { SiteVisibility } from '@portfolio/data/domain/types';
import { aboutRouteVisible } from './about-route-visible';

export function visibleAboutRoutes(visibility: SiteVisibility | undefined): string[] {
  return aboutRoutes.filter((route) => aboutRouteVisible(visibility, route));
}
