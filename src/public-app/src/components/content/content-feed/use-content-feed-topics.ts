'use client';

import { useMemo } from 'react';
import { buildFeedTopics } from './build-feed-topics';
import type { FeedEntry } from './types';
import type { UseContentFeedDataProps } from './use-content-feed-data.types';

type UseContentFeedTopicsProps = {
  input: UseContentFeedDataProps;
  entries: FeedEntry[];
  serverManaged: boolean;
};

export function useContentFeedTopics(props: UseContentFeedTopicsProps) {
  return useMemo(
    () =>
      buildFeedTopics({
        entries: props.entries,
        serverManaged: props.serverManaged,
        findingFacets: props.input.findingFacets,
      }),
    [props.entries, props.input.findingFacets, props.serverManaged],
  );
}
