import type { ContentFeedDisplayMode } from './types';
import { buildFeedNavigationHref } from './build-feed-navigation-href';

type BuildFeedDisplayModeHrefProps = {
  action: string;
  query: URLSearchParams;
  mode: ContentFeedDisplayMode;
  perPage: number;
};

export function buildFeedDisplayModeHref(props: BuildFeedDisplayModeHrefProps) {
  return buildFeedNavigationHref(props.action, props.query, (params) => {
    params.delete('page');
    params.set('view', props.mode);
    params.set('per_page', String(props.perPage));
  });
}
