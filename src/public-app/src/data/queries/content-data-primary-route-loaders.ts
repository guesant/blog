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
  getFindingList,
  getLicensePageCopy,
} from '@portfolio/data/services';
import type { CaseStudy, Experiment, Project } from '@portfolio/data/domain/types';
import { collectionQuery } from './content-data-collection-query';
import { findingFilters } from './content-data-finding-filters';
import { collectionRouteLoaders } from './content-data-primary-collection-route-loaders';
import { resumePdfUrls } from './content-data-resume-pdf-urls';
import type { RouteLoadContext, RouteLoader } from './content-data-route-loader';

export const primaryRouteLoaders: Record<string, RouteLoader> = {
  ...collectionRouteLoaders,
  '/': async ({ locale, search }, context?: RouteLoadContext) => {
    const [content, feed] = await Promise.all([
      getHomePageContent(locale, context?.shell),
      getHomeFeedPage(locale, collectionQuery(search, 'page', 4)),
    ]);

    return {
      kind: 'home',
      content,
      feedItems: feed.items,
      feedPagination: feed.meta,
      feedSearch: search ?? '',
    };
  },
  '/about': async ({ locale }, context?: RouteLoadContext) => ({
    kind: 'about',
    page: await getAboutPageCopy(locale),
    profile: context?.shell?.profile ?? (await getProfile(locale)),
  }),
  '/portfolio': async ({ locale, search }, context?: RouteLoadContext) => {
    const [page, profile, cases, projects, experiments] = await Promise.all([
      getPortfolioPageCopy(locale),
      context?.shell?.profile ?? getProfile(locale),
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
      search: search ?? '',
    };
  },
  '/now': async ({ locale }) => ({ kind: 'now', page: await getNowPageCopy(locale) }),
  '/contact': async ({ locale }, context?: RouteLoadContext) => ({
    kind: 'contact',
    page: await getContactPageCopy(locale),
    site: context?.shell?.site ?? (await getSiteText(locale)),
  }),
  '/credits': async ({ locale, search }) => ({
    kind: 'credits',
    content: await getCreditsPageContent(locale, collectionQuery(search)),
  }),
  '/findings': async ({ locale, search }) => {
    const [page, initialData] = await Promise.all([
      getAchadosPageCopy(locale),
      getFindingList(findingFilters(search), locale),
    ]);

    return {
      kind: 'findings',
      page,
      request: { locale, search },
      initialData,
    };
  },
  '/license': async ({ locale }, context?: RouteLoadContext) => ({
    kind: 'license',
    page: await getLicensePageCopy(locale),
    site: context?.shell?.site ?? (await getSiteText(locale)),
  }),
  '/follow': async ({ locale }, context?: RouteLoadContext) => ({
    kind: 'follow',
    page: await getFollowPageCopy(locale),
    site: context?.shell?.site ?? (await getSiteText(locale)),
  }),
  '/resume': async ({ locale }, context?: RouteLoadContext) => ({
    kind: 'resume',
    content: await getResumePageContent(locale, context?.shell),
    pdfUrls: resumePdfUrls(),
  }),
};
