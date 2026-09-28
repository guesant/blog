import type { SiteText } from '@portfolio/data/domain/types';

export function sidebarContactVisible(site: SiteText): boolean {
  return site.contact.enabled;
}
