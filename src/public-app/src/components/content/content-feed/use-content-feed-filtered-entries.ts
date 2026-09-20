'use client';

import { useMemo } from 'react';
import { filterFeedEntries } from './filter-feed-entries';
import type { FeedEntry } from './types';
import type { UseContentFeedDataProps } from './use-content-feed-data.types';

type UseContentFeedFilteredEntriesProps = {
  input: UseContentFeedDataProps;
  entries: FeedEntry[];
  serverManaged: boolean;
};

export function useContentFeedFilteredEntries(props: UseContentFeedFilteredEntriesProps) {
  return useMemo(
    () =>
      filterFeedEntries({
        ...props.input,
        entries: props.entries,
        serverManaged: props.serverManaged,
      }),
    [props.entries, props.input, props.serverManaged],
  );
}
