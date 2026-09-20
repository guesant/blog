import type { SiteVisibility } from '@portfolio/data/domain/types';

export function homeVisibilityEnabled(
  visibility: SiteVisibility | undefined,
  key: keyof SiteVisibility,
): boolean {
  return visibility?.[key] ?? true;
}
