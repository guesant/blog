import type { SiteText } from '@portfolio/data/domain/types';

export function sidebarContactVisible(site: SiteText): boolean {
  return site.visibility?.contact ?? site.contact.available;
}
