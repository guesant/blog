import type { SiteText } from '../domain/types.ts';
import { siteVisibility } from './public-site-source-site-visibility';
import { getSnapshot } from './public-site-source-get-snapshot';
import { objectValue } from './public-site-source-object-value';
import { stringValue } from './public-site-source-string-value';
import { siteContact } from './public-site-source-site-contact';
import { siteMaintenance } from './public-site-source-site-maintenance';
import { siteNavigation } from './public-site-source-site-navigation';
import { resolveEmailChallenge } from './public-site-source-resolve-email-challenge';
import { recordOrEmpty } from './public-site-source-record-or-empty';
import { siteBuild } from './public-site-source-site-build';

export async function getLocalizedSiteText(locale?: string): Promise<SiteText> {
  const snapshot = await getSnapshot(locale);

  const site = recordOrEmpty(snapshot.chrome.site);

  const emailChallenge = await resolveEmailChallenge(site);

  return {
    shortName: stringValue(site.short_name),
    portfolioUrl: stringValue(site.portfolio_url),
    sourceRepositoryUrl: stringValue(site.source_repository_url),
    copyrightTemplate: stringValue(snapshot.chrome.copyright),
    maintenanceEnabled: site.maintenance_enabled === true,
    maintenance: siteMaintenance(site),
    contact: siteContact(site, emailChallenge),
    navigation: siteNavigation(snapshot.chrome.navigation),
    visibility: siteVisibility(recordOrEmpty(snapshot.chrome.visibility)),
    build: siteBuild(objectValue(snapshot.chrome.build)),
    seo: objectValue(site.seo),
  };
}
