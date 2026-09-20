import { getLocalizedSiteText } from '../api/public-site-source.ts';
import type { SiteText } from '../domain/types.ts';

export async function getSiteText(locale?: string): Promise<SiteText> {
  return getLocalizedSiteText(locale);
}
