import type { SiteText } from '../domain/types.ts';

export function contactNavigationAvailable(site: SiteText): boolean {
  return site.contact.enabled;
}
