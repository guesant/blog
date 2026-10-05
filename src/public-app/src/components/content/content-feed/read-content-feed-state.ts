import type { ContentFeedProps, SortMode } from './types';
import { readContentFeedQueryValue } from './read-content-feed-query-value';
import { contentFeedInitialValue } from './content-feed-initial-value';

type ReadContentFeedStateProps = Pick<
  ContentFeedProps,
  'fixedKind' | 'initialKind' | 'initialTopic' | 'initialSearch' | 'initialSort' | 'initialType'
> & {
  query: URLSearchParams;
};

export type ContentFeedState = {
  kind: string;
  topic: string;
  search: string;
  pendingSearch: string;
  sort: SortMode;
  type: string;
};

export function readContentFeedState(props: ReadContentFeedStateProps): ContentFeedState {
  const search = readContentFeedQueryValue(
    props.query,
    'q',
    contentFeedInitialValue(props.initialSearch, ''),
  );

  return {
    kind: contentFeedInitialValue(
      props.fixedKind,
      readContentFeedQueryValue(
        props.query,
        'kind',
        contentFeedInitialValue(props.initialKind, 'all'),
      ),
    ),
    topic: readContentFeedQueryValue(
      props.query,
      'topic',
      contentFeedInitialValue(props.initialTopic, ''),
    ),
    search,
    pendingSearch: search,
    sort: readContentFeedQueryValue(
      props.query,
      'sort',
      contentFeedInitialValue(props.initialSort, 'desc'),
    ) as SortMode,
    type: readContentFeedQueryValue(
      props.query,
      'type',
      contentFeedInitialValue(props.initialType, ''),
    ),
  };
}
