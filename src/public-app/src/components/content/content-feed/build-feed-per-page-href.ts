import { buildFeedNavigationHref } from './build-feed-navigation-href';

export function buildFeedPerPageHref(action: string, query: URLSearchParams, perPage: number) {
  return buildFeedNavigationHref(action, query, (params) => {
    params.delete('page');
    params.set('per_page', String(perPage));
  });
}
