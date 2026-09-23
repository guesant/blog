import {
  getFeaturedContent,
  getContentCollectionPage,
  getLocalizedPage,
} from '../api/public-site-source.ts';
import type { Experiment, HomePageContent, HomePageCopy } from '../domain/types.ts';
import { homeTechnologies } from './content-service-home-technologies';
import { resolveHomeProfile } from './content-service-resolve-home-profile';
import { resolveHomeSite } from './content-service-resolve-home-site';

export async function getHomePageContent(
  locale?: string,
  shell?: Pick<HomePageContent, 'profile' | 'site'>,
): Promise<HomePageContent> {
  const [featured, experiments, page] = await Promise.all([
    getFeaturedContent(locale),
    getContentCollectionPage<Experiment>('experiments', locale, { page: 1, perPage: 1 }),
    getLocalizedPage<HomePageCopy>('home', locale),
  ]);

  return {
    cases: featured.cases,
    projects: featured.projects,
    experiments: experiments.items,
    experimentsCount: experiments.meta.total,
    profile: await resolveHomeProfile(locale, shell),
    page,
    site: await resolveHomeSite(locale, shell),
    recurringTechnologies: homeTechnologies(page),
  };
}
