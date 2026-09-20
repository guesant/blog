import type { ContentFeedProps } from './types';
import type { ContentFeedState } from './read-content-feed-state';

export type UseContentFeedDataProps = Pick<
  ContentFeedProps,
  | 'writings'
  | 'findings'
  | 'collections'
  | 'fixedKind'
  | 'findingFacets'
  | 'findingsMeta'
  | 'initialPage'
> &
  ContentFeedState & {
    query: URLSearchParams;
  };
