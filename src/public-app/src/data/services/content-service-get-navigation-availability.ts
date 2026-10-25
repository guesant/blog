import { getLocalizedSiteText } from '../api/public-site-source.ts';
import type { NavigationAvailability } from '../domain/types.ts';
import { contactNavigationAvailable } from './content-service-contact-navigation-available';

export async function getNavigationAvailability(locale?: string): Promise<NavigationAvailability> {
  const site = await getLocalizedSiteText(locale);

  const visibility = site.visibility;

  const contact = contactNavigationAvailable(site);

  return {
    writing: visibility?.writing ?? true,
    contact,
  };
}
