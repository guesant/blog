'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { contentQueryStaleTimeMs } from './content-query-cache-policy';
import { contentQueryRetryCount } from './content-query-retry-policy';
import { appendProgressiveContentItems } from './append-progressive-content-items';
import type { ProgressiveContentPage, ProgressiveContentQuery } from './progressive-content-types';

export function useProgressiveContent<T>(props: ProgressiveContentQuery<T>) {
  const query = useInfiniteQuery<ProgressiveContentPage<T>>({
    queryKey: props.queryKey,
    initialPageParam: props.initialPage.meta.page,
    initialData: {
      pages: [props.initialPage],
      pageParams: [props.initialPage.meta.page],
    },
    queryFn: ({ pageParam }) => props.loadPage(Number(pageParam)),
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.page >= lastPage.meta.lastPage) {
        return undefined;
      }

      return lastPage.meta.page + 1;
    },
    staleTime: contentQueryStaleTimeMs,
    retry: contentQueryRetryCount,
  });

  const items = useMemo(
    () =>
      appendProgressiveContentItems(
        query.data?.pages.map((page) => page.items) ?? [props.initialPage.items],
        props.getKey,
      ),
    [props.getKey, props.initialPage.items, query.data?.pages],
  );

  return {
    ...query,
    items,
    meta: query.data?.pages.at(-1)?.meta ?? props.initialPage.meta,
  };
}
