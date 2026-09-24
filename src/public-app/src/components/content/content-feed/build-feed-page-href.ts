import { buildFeedNavigationHref } from './build-feed-navigation-href';

export function buildFeedPageHref(action: string, query: URLSearchParams, page: number) {
  return buildFeedNavigationHref(action, query, (params) => {
    params.set('page', String(page));
  });
}
