'use client';

import { useMemo } from 'react';
import { buildFeedTopics } from './build-feed-topics';
import type { UseContentFeedDataProps } from './use-content-feed-data.types';

type UseContentFeedTopicsProps = {
  input: UseContentFeedDataProps;
};

export function useContentFeedTopics(props: UseContentFeedTopicsProps) {
  return useMemo(
    () =>
      buildFeedTopics({
        findingFacets: props.input.findingFacets,
      }),
    [props.input.findingFacets],
  );
}
