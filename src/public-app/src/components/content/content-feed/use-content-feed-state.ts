'use client';

import { useEffect, useState } from 'react';
import type { ContentFeedProps } from './types';
import { readContentFeedState, type ContentFeedState } from './read-content-feed-state';

type UseContentFeedStateProps = Pick<
  ContentFeedProps,
  'fixedKind' | 'initialKind' | 'initialTopic' | 'initialSearch' | 'initialSort' | 'initialType'
> & {
  query: URLSearchParams;
};

export function useContentFeedState(props: UseContentFeedStateProps) {
  const [state, setState] = useState<ContentFeedState>(() => readContentFeedState(props));

  useEffect(() => {
    setState(readContentFeedState(props));
  }, [
    props.fixedKind,
    props.initialKind,
    props.initialTopic,
    props.initialSearch,
    props.initialSort,
    props.initialType,
    props.query,
  ]);

  return {
    ...state,
    setKind: (value: string) => setState((current) => ({ ...current, kind: value })),
    setTopic: (value: string) => setState((current) => ({ ...current, topic: value })),
    setSearch: (value: string) => setState((current) => ({ ...current, search: value })),
    setPendingSearch: (value: string) =>
      setState((current) => ({ ...current, pendingSearch: value })),
    setSort: (value: ContentFeedState['sort']) =>
      setState((current) => ({ ...current, sort: value })),
    setType: (value: string) => setState((current) => ({ ...current, type: value })),
  };
}
