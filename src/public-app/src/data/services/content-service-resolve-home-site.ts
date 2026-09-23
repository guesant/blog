import type { HomePageContent, SiteText } from '../domain/types.ts';
import { getLocalizedSiteText } from '../api/public-site-source.ts';

export async function resolveHomeSite(
  locale: string | undefined,
  shell: Pick<HomePageContent, 'site'> | undefined,
): Promise<SiteText> {
  if (shell?.site) return shell.site;

  return getLocalizedSiteText(locale);
}
