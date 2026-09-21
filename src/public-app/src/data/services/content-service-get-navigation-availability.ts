import { getLocalizedSiteText } from '../api/public-site-source.ts';
import type { NavigationAvailability } from '../domain/types.ts';
import { contactNavigationAvailable } from './content-service-contact-navigation-available';
import { navigationVisibilityFlag } from './content-service-navigation-visibility-flag';

export async function getNavigationAvailability(locale?: string): Promise<NavigationAvailability> {
  const site = await getLocalizedSiteText(locale);

  const visibility = site.visibility;

  const contact = contactNavigationAvailable(site);

  return {
    cases: navigationVisibilityFlag(visibility?.cases),
    projects: navigationVisibilityFlag(visibility?.portfolio),
    writing: navigationVisibilityFlag(visibility?.writing),
    achados: navigationVisibilityFlag(visibility?.findings),
    contact,
  };
}
