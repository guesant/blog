'use client';

import { useCallback, useMemo, useRef } from 'react';
import { appendProgressiveContentItems } from './append-progressive-content-items';
import { prefetchProgressiveContentPages } from './prefetch-progressive-content-pages';
import type { ProgressiveContentQuery } from './progressive-content-types';
import { useProgressiveContentQuery } from './use-progressive-content-query';

export function useProgressiveContent<T>(props: ProgressiveContentQuery<T>) {
  const prefetchingRef = useRef(false);

  const query = useProgressiveContentQuery(props);

  const items = useMemo(
    () =>
      appendProgressiveContentItems(
        query.data?.pages.map((page) => page.items) ?? [props.initialPage.items],
        props.getKey,
      ),
    [props.getKey, props.initialPage.items, query.data?.pages],
  );

  const fetchNextPages = useCallback(async () => {
    if (prefetchingRef.current) {
      return;
    }

    prefetchingRef.current = true;

    try {
      await prefetchProgressiveContentPages(query.fetchNextPage);
    } finally {
      prefetchingRef.current = false;
    }
  }, [query.fetchNextPage]);

  return {
    ...query,
    items,
    meta: query.data?.pages.at(-1)?.meta ?? props.initialPage.meta,
    fetchNextPage: fetchNextPages,
  };
}
