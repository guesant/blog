import type { SiteText } from '../domain/types.ts';

export function contactNavigationAvailable(site: SiteText): boolean {
  if (!site.contact.available) return false;

  return site.contact.hasEmail || site.contact.profiles.length > 0;
}
