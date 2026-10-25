import type { SiteVisibility } from '@portfolio/data/domain/types';
import { sidebarVisibilityEnabled } from './sidebar-visibility-enabled';

export function aboutRouteVisible(visibility: SiteVisibility | undefined, route: string): boolean {
  return route === 'now' || sidebarVisibilityEnabled(visibility, 'about');
}
