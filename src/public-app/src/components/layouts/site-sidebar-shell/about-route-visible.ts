import type { SiteVisibility } from '@portfolio/data/domain/types';
import { sidebarVisibilityEnabled } from './sidebar-visibility-enabled';

const aboutVisibilityKeys: Record<string, keyof SiteVisibility> = {
  resume: 'resume',
  portfolio: 'portfolio',
  cases: 'cases',
};

export function aboutRouteVisible(visibility: SiteVisibility | undefined, route: string): boolean {
  return sidebarVisibilityEnabled(visibility, aboutVisibilityKeys[route] ?? 'cases');
}
