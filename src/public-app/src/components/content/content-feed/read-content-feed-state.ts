import type { ContentFeedProps, SortMode } from './types';
import { readContentFeedQueryValue } from './read-content-feed-query-value';
import { contentFeedInitialValue } from './content-feed-initial-value';
import { contentFeedPageSizeValue } from './content-feed-page-size-value';

type ReadContentFeedStateProps = Pick<
  ContentFeedProps,
  | 'fixedKind'
  | 'initialKind'
  | 'initialTopic'
  | 'initialSearch'
  | 'initialSort'
  | 'initialType'
  | 'initialPerPage'
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
  perPage: number;
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
    perPage: contentFeedPageSizeValue(props.query.get('per_page'), props.initialPerPage ?? 50),
  };
}
