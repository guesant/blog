import { useCallback } from 'react';
import type { ContentFeedRouter } from './use-content-feed-actions.types';

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
    (value: number) => {
      const params = new URLSearchParams(Object.fromEntries(props.query));

      params.delete('view');
      params.set('page', String(value));
      return `${props.action}?${params.toString()}`;
    },
    [props.action, props.query],
  );

  return { pageHref, scrollToFeedAfter };
}
