'use client';

import { useMemo } from 'react';
import { buildContentFeedEntries } from './build-content-feed-entries';
import type { UseContentFeedDataProps } from './use-content-feed-data.types';

type UseContentFeedEntriesProps = {
  input: UseContentFeedDataProps;
};

export function useContentFeedEntries(props: UseContentFeedEntriesProps) {
  return useMemo(
    () => buildContentFeedEntries(props.input),
    [props.input.collections, props.input.feedItems, props.input.findings, props.input.writings],
  );
}
