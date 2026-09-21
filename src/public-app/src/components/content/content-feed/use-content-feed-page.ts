'use client';

import { useMemo } from 'react';
import { contentFeedPageData } from './content-feed-page-data';
import type { FeedEntry } from './types';
import type { UseContentFeedDataProps } from './use-content-feed-data.types';

type UseContentFeedPageProps = {
  input: UseContentFeedDataProps;
  entries: FeedEntry[];
  serverManaged: boolean;
};

export function useContentFeedPage(props: UseContentFeedPageProps) {
  return useMemo(
    () =>
      contentFeedPageData({
        entries: props.entries,
        findingsMeta: props.input.findingsMeta,
        contentMeta: props.input.contentMeta,
        initialPage: props.input.initialPage ?? 1,
        pageFromQuery: Number(props.input.query.get('page') || props.input.initialPage || 1),
        serverManaged: props.serverManaged,
      }),
    [
      props.entries,
      props.input.findingsMeta,
      props.input.contentMeta,
      props.input.initialPage,
      props.input.query,
      props.serverManaged,
    ],
  );
}
