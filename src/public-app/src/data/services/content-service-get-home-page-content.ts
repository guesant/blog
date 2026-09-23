import {
  getFeaturedContent,
  getContentCollectionPage,
  getLocalizedPage,
  getLocalizedProfile,
  getLocalizedSiteText,
  listTechnologies,
} from '../api/public-site-source.ts';
import type { Experiment, HomePageContent, HomePageCopy } from '../domain/types.ts';

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
    profile: shell?.profile ?? (await getLocalizedProfile(locale)),
    page,
    site: shell?.site ?? (await getLocalizedSiteText(locale)),
    recurringTechnologies: await listTechnologies(
      [...featured.cases, ...featured.projects].flatMap((item) => item.technologySlugs ?? []),
      locale,
    ),
  };
}
