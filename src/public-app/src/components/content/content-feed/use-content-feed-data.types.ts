import type { ContentFeedProps } from './types';
import type { ContentFeedState } from './read-content-feed-state';

export type UseContentFeedDataProps = Pick<
  ContentFeedProps,
  'feedItems' | 'fixedKind' | 'findingFacets' | 'contentMeta' | 'initialPage'
> &
  ContentFeedState & {
    query: URLSearchParams;
  };
