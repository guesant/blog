import type { SiteText } from '../domain/types.ts';
import { siteVisibility } from './public-site-source-site-visibility';
import { objectValue } from './public-site-source-object-value';
import { stringValue } from './public-site-source-string-value';
import { siteContact } from './public-site-source-site-contact';
import { siteMaintenance } from './public-site-source-site-maintenance';
import { siteNavigation } from './public-site-source-site-navigation';
import { recordOrEmpty } from './public-site-source-record-or-empty';
import { siteBuild } from './public-site-source-site-build';
import { getLocalizedSiteChrome } from './public-site-source-get-localized-site-chrome';
import type { RecordValue } from './public-site-source-support';

export async function getLocalizedSiteText(
  locale?: string,
  chrome?: RecordValue,
): Promise<SiteText> {
  const resolvedChrome = chrome ?? (await getLocalizedSiteChrome(locale));

  const site = recordOrEmpty(resolvedChrome.site);

  const copyright = stringValue(resolvedChrome.copyright);

  return {
    shortName: stringValue(site.short_name),
    portfolioUrl: stringValue(site.portfolio_url),
    sourceRepositoryUrl: stringValue(site.source_repository_url),
    copyrightTemplate: copyright,
    maintenanceEnabled: site.maintenance_enabled === true,
    maintenance: siteMaintenance(site),
    contact: siteContact(site, undefined),
    navigation: siteNavigation(resolvedChrome.navigation),
    visibility: siteVisibility(recordOrEmpty(resolvedChrome.visibility)),
    build: siteBuild(objectValue(resolvedChrome.build)),
    seo: objectValue(site.seo),
  };
}
