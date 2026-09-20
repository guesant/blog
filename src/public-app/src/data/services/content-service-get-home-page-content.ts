import {
  getFeaturedContent,
  getLocalizedPage,
  getLocalizedProfile,
  getLocalizedResume,
  getLocalizedSiteText,
  listTechnologies,
} from '../api/public-site-source.ts';
import type { HomePageContent, HomePageCopy } from '../domain/types.ts';
import { getExperiments } from './content-service-get-experiments';

export async function getHomePageContent(locale?: string): Promise<HomePageContent> {
  const [featured, experiments, page] = await Promise.all([
    getFeaturedContent(locale),
    getExperiments(locale),
    getLocalizedPage<HomePageCopy>('home', locale),
  ]);

  return {
    cases: featured.cases,
    projects: featured.projects,
    experiments,
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
