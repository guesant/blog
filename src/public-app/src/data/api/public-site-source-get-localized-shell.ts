import type { NavigationAvailability, Profile, SiteText } from '../domain/types';
import { contactNavigationAvailable } from '../services/content-service-contact-navigation-available';
import { navigationVisibilityFlag } from '../services/content-service-navigation-visibility-flag';
import { getLocalizedProfile } from './public-site-source-get-localized-profile';
import { getLocalizedSiteChrome } from './public-site-source-get-localized-site-chrome';
import { getLocalizedSiteText } from './public-site-source-get-localized-site-text';

export type LocalizedShell = {
  profile: Profile;
  site: SiteText;
  availability: NavigationAvailability;
};

export async function getLocalizedShell(locale?: string): Promise<LocalizedShell> {
  const chrome = await getLocalizedSiteChrome(locale);

  const [profile, site] = await Promise.all([
    getLocalizedProfile(locale, chrome),
    getLocalizedSiteText(locale, chrome),
  ]);

  const visibility = site.visibility;

  return {
    profile,
    site,
    availability: {
      cases: navigationVisibilityFlag(visibility?.cases),
      projects: navigationVisibilityFlag(visibility?.portfolio),
      writing: navigationVisibilityFlag(visibility?.writing),
      achados: navigationVisibilityFlag(visibility?.findings),
      contact: contactNavigationAvailable(site),
    },
  };
}
