import {
  getFeaturedContent,
  getContentCollectionPage,
  getLocalizedPage,
  getLocalizedProfile,
  getLocalizedResume,
  getLocalizedSiteText,
  listTechnologies,
} from '../api/public-site-source.ts';
import type { Experiment, HomePageContent, HomePageCopy } from '../domain/types.ts';

export async function getHomePageContent(locale?: string): Promise<HomePageContent> {
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
    writings: featured.writings,
    profile: await getLocalizedProfile(locale),
    resume: await getLocalizedResume(locale),
    page,
    site: await getLocalizedSiteText(locale),
    recurringTechnologies: await listTechnologies(
      [...featured.cases, ...featured.projects].flatMap((item) => item.technologySlugs ?? []),
      locale,
    ),
  };
}
