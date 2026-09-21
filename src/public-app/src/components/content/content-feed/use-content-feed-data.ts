'use client';

import { buildContentFeedFindingTypes } from './build-content-feed-finding-types';
import { hasActiveContentFeedFilters } from './has-active-content-feed-filters';
import { contentFeedAvailableKindCount } from './content-feed-available-kind-count';
import { useContentFeedEntries } from './use-content-feed-entries';
import { useContentFeedFilteredEntries } from './use-content-feed-filtered-entries';
import { useContentFeedPage } from './use-content-feed-page';
import { useContentFeedTopics } from './use-content-feed-topics';
import type { UseContentFeedDataProps } from './use-content-feed-data.types';

export function useContentFeedData(props: UseContentFeedDataProps) {
  const serverManaged = props.fixedKind === 'achado' || Boolean(props.contentMeta);

  const entries = useContentFeedEntries({ input: props, serverManaged });

  const topics = useContentFeedTopics({ input: props, entries, serverManaged });

  const filteredEntries = useContentFeedFilteredEntries({ input: props, entries, serverManaged });

  const pageData = useContentFeedPage({ input: props, entries: filteredEntries, serverManaged });

  return {
    serverManaged,
    entries,
    topics,
    filteredEntries,
    findingTypes: buildContentFeedFindingTypes({ ...props, serverManaged }),
    availableKindCount: contentFeedAvailableKindCount(props),
    hasActiveFilters: hasActiveContentFeedFilters(props),
    ...pageData,
  };
}
