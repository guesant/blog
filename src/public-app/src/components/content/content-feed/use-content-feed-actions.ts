'use client';

import { useApplyContentFeedFilters } from './use-apply-content-feed-filters';
import { useApplyContentFeedQuickFilter } from './use-apply-content-feed-quick-filter';
import { useClearContentFeedFilters } from './use-clear-content-feed-filters';
import type { ContentFeedActionProps } from './use-content-feed-actions.types';
import { useFeedNavigation } from './use-feed-navigation';

export function useContentFeedActions(props: ContentFeedActionProps) {
  const navigation = useFeedNavigation({
    action: props.action,
    query: props.query,
    router: props.router,
  });

  const applyFilters = useApplyContentFeedFilters({
    ...props,
    scrollToFeedAfter: navigation.scrollToFeedAfter,
  });

  const clearFilters = useClearContentFeedFilters({
    ...props,
    scrollToFeedAfter: navigation.scrollToFeedAfter,
  });

  const applyQuickFilter = useApplyContentFeedQuickFilter({
    ...props,
    scrollToFeedAfter: navigation.scrollToFeedAfter,
  });

  return { applyFilters, clearFilters, applyQuickFilter, pageHref: navigation.pageHref };
}
