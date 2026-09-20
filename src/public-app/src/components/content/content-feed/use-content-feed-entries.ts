'use client';

import { useMemo } from 'react';
import { buildContentFeedEntries } from './build-content-feed-entries';
import type { UseContentFeedDataProps } from './use-content-feed-data.types';

type UseContentFeedEntriesProps = {
  input: UseContentFeedDataProps;
  serverManaged: boolean;
};

export function useContentFeedEntries(props: UseContentFeedEntriesProps) {
  return useMemo(
    () => buildContentFeedEntries({ ...props.input, serverManaged: props.serverManaged }),
    [props.input.collections, props.input.findings, props.input.writings, props.serverManaged],
  );
}
