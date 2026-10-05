import { useCallback } from 'react';
import type { ContentFeedRouter } from './use-content-feed-actions.types';
import { buildFeedPageHref } from './build-feed-page-href';

type UseFeedNavigationProps = {
  action: string;
  query: URLSearchParams;
  router: ContentFeedRouter;
};

export function useFeedNavigation(props: UseFeedNavigationProps) {
  const pageHref = useCallback(
    (value: number) => buildFeedPageHref(props.action, props.query, value),
    [props.action, props.query],
  );

  const navigate = useCallback(
    (href: string) => {
      props.router.push(href, { resetScroll: false });
    },
    [props.router],
  );

  return { pageHref, navigate };
}
