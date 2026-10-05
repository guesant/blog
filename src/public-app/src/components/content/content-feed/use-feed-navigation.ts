import { useCallback } from 'react';
import type { ContentFeedRouter } from './use-content-feed-actions.types';
import { buildFeedPageHref } from './build-feed-page-href';

type UseFeedNavigationProps = {
  action: string;
  query: URLSearchParams;
  router: ContentFeedRouter;
};

export function useFeedNavigation(props: UseFeedNavigationProps) {
  const scrollToFeed = useCallback(() => {
    document.getElementById('content-feed')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const scrollToFeedAfter = useCallback(
    (navigation: Promise<unknown>) => {
      void navigation.then(
        () => requestAnimationFrame(scrollToFeed),
        () => requestAnimationFrame(scrollToFeed),
      );
    },
    [scrollToFeed],
  );

  const pageHref = useCallback(
    (value: number) => buildFeedPageHref(props.action, props.query, value),
    [props.action, props.query],
  );

  const navigate = useCallback(
    (href: string) => {
      scrollToFeedAfter(props.router.push(href, { resetScroll: false }));
    },
    [props.router, scrollToFeedAfter],
  );

  return { pageHref, scrollToFeedAfter, navigate };
}
