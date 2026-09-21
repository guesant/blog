import {
  getAboutPageCopy,
  getAchadosPageCopy,
  getCollectionPage,
  getContactPageCopy,
  getHomePageContent,
  getHomeFeedPage,
  getNowPageCopy,
  getPortfolioPageCopy,
  getProfile,
  getResumePageContent,
  getSiteText,
  getCreditsPageContent,
  getFollowPageCopy,
  getLicensePageCopy,
} from '@portfolio/data/services';
import type { CaseStudy, Experiment, Project } from '@portfolio/data/domain/types';
import { collectionQuery } from './content-data-collection-query';
import { collectionRouteLoaders } from './content-data-primary-collection-route-loaders';
import { resumePdfUrls } from './content-data-resume-pdf-urls';
import type { RouteLoader } from './content-data-route-loader';
import { statusData } from './content-data-status-data';

export const primaryRouteLoaders: Record<string, RouteLoader> = {
  ...collectionRouteLoaders,
  '/': async ({ locale, search }) => {
    const [content, feed] = await Promise.all([
      getHomePageContent(locale),
      getHomeFeedPage(locale, collectionQuery(search)),
    ]);

    return {
      kind: 'home',
      content,
      writings: feed.writings,
      findings: feed.findings,
      collections: feed.collections,
      feedPagination: feed.meta,
    };
  },
  '/about': async ({ locale }) => ({
    kind: 'about',
    page: await getAboutPageCopy(locale),
    profile: await getProfile(locale),
  }),
  '/portfolio': async ({ locale, search }) => {
    const [page, profile, cases, projects, experiments] = await Promise.all([
      getPortfolioPageCopy(locale),
      getProfile(locale),
      getCollectionPage<CaseStudy>('cases', locale, collectionQuery(search, 'portfolio_page', 3)),
      getCollectionPage<Project>('projects', locale, collectionQuery(search, 'portfolio_page', 3)),
      getCollectionPage<Experiment>(
        'experiments',
        locale,
        collectionQuery(search, 'portfolio_page', 3),
      ),
    ]);

    return {
      kind: 'portfolio',
      page,
      profile,
      cases: cases.items,
      casesPagination: cases.meta,
      projects: projects.items,
      projectsPagination: projects.meta,
      experiments: experiments.items,
      experimentsPagination: experiments.meta,
    };
  },
  '/now': async ({ locale }) => ({ kind: 'now', page: await getNowPageCopy(locale) }),
  '/contact': async ({ locale }) => ({
    kind: 'contact',
    page: await getContactPageCopy(locale),
    site: await getSiteText(locale),
  }),
  '/credits': async ({ locale, search }) => ({
    kind: 'credits',
    content: await getCreditsPageContent(locale, collectionQuery(search)),
  }),
  '/findings': async ({ locale, search }) => ({
    kind: 'findings',
    page: await getAchadosPageCopy(locale),
    request: { locale, search },
  }),
  '/license': async ({ locale }) => ({
    kind: 'license',
    page: await getLicensePageCopy(locale),
    site: await getSiteText(locale),
  }),
  '/follow': async ({ locale }) => ({
    kind: 'follow',
    page: await getFollowPageCopy(locale),
    site: await getSiteText(locale),
  }),
  '/resume': async ({ locale }) => ({
    kind: 'resume',
    content: await getResumePageContent(locale),
    pdfUrls: resumePdfUrls(),
  }),
  '/tools': async ({ locale }) => statusData(locale, 'notFound'),
  '/tool': async ({ locale }) => statusData(locale, 'notFound'),
};
