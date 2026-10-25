import {
  getAboutPageCopy,
  getContactPageCopy,
  getHomePageContent,
  getNowPageCopy,
  getProfile,
  getSiteText,
  getCreditsPageContent,
  getFollowPageCopy,
  getFeedPage,
  getLicensePageCopy,
} from '@portfolio/data/services';
import { homeFeedQuery } from './content-data-home-feed-query';
import { collectionRouteLoaders } from './content-data-primary-collection-route-loaders';
import { collectionQuery } from './content-data-collection-query';
import type { RouteLoadContext, RouteLoader } from './content-data-route-loader';

export const primaryRouteLoaders: Record<string, RouteLoader> = {
  ...collectionRouteLoaders,
  '/': async ({ locale, search }, context?: RouteLoadContext) => {
    const [content, feed] = await Promise.all([
      getHomePageContent(locale, context?.shell),
      getFeedPage(locale, homeFeedQuery(search)),
    ]);

    return {
      kind: 'home',
      content,
      feedItems: feed.items,
      feedPagination: feed.meta,
    };
  },
  '/about': async ({ locale }, context?: RouteLoadContext) => ({
    kind: 'about',
    page: await getAboutPageCopy(locale),
    profile: context?.shell?.profile ?? (await getProfile(locale)),
  }),
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
};
