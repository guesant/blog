'use client';

import { buildContentFeedFindingTypes } from './build-content-feed-finding-types';
import { hasActiveContentFeedFilters } from './has-active-content-feed-filters';
import { contentFeedAvailableKindCount } from './content-feed-available-kind-count';
import { useContentFeedEntries } from './use-content-feed-entries';
import { useContentFeedPage } from './use-content-feed-page';
import { useContentFeedTopics } from './use-content-feed-topics';
import type { UseContentFeedDataProps } from './use-content-feed-data.types';

export function useContentFeedData(props: UseContentFeedDataProps) {
  const entries = useContentFeedEntries({ input: props });

  const topics = useContentFeedTopics({ input: props });

  const pageData = useContentFeedPage({ input: props, entries });

  return {
    entries,
    topics,
    findingTypes: buildContentFeedFindingTypes(props),
    availableKindCount: contentFeedAvailableKindCount(props),
    hasActiveFilters: hasActiveContentFeedFilters(props),
    ...pageData,
  };
}
