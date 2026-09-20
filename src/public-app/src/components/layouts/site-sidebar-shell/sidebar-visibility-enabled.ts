import type { SiteVisibility } from '@portfolio/data/domain/types';

export function sidebarVisibilityEnabled(
  visibility: SiteVisibility | undefined,
  key: keyof SiteVisibility,
): boolean {
  return visibility?.[key] ?? true;
}
