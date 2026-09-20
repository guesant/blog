import { sidebarVisibilityEnabled } from './sidebar-visibility-enabled';
import type { SiteVisibility } from '@portfolio/data/domain/types';

export function sidebarUpdatesVisible(visibility: SiteVisibility | undefined): boolean {
  return sidebarVisibilityEnabled(visibility, 'follow');
}
