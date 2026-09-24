import type { ContentFeedDisplayMode, ContentFeedProps } from './types';
import type { ContentFeedState } from './read-content-feed-state';

export type ContentFeedProgressiveProps = Pick<
  ContentFeedProps,
  'feedItems' | 'contentMeta' | 'fixedKind' | 'action'
> &
  Pick<ContentFeedState, 'kind' | 'topic' | 'type' | 'search' | 'sort' | 'perPage'> & {
    locale: string;
    query: URLSearchParams;
    displayMode: ContentFeedDisplayMode;
  };
