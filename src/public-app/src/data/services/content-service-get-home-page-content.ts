import { getPublicHomeGallery, getLocalizedPage } from '../api/public-site-source.ts';
import { normalizeLocale } from '../api/public-site-source-normalize-locale';
import type { HomePageContent, HomePageCopy } from '../domain/types.ts';
import { homeTechnologies } from './content-service-home-technologies';
import { resolveHomeProfile } from './content-service-resolve-home-profile';
import { resolveHomeSite } from './content-service-resolve-home-site';

export async function getHomePageContent(
  locale?: string,
  shell?: Pick<HomePageContent, 'profile' | 'site'>,
): Promise<HomePageContent> {
  const language = normalizeLocale(locale);

  const [gallery, page] = await Promise.all([
    getPublicHomeGallery(language),
    getLocalizedPage<HomePageCopy>('home', locale),
  ]);

  return {
    profile: await resolveHomeProfile(locale, shell),
    page,
    site: await resolveHomeSite(locale, shell),
    recurringTechnologies: homeTechnologies(page),
    gallery,
  };
}
