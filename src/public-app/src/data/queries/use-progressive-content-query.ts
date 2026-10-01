'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { contentQueryStaleTimeMs } from './content-query-cache-policy';
import { contentQueryRetryCount } from './content-query-retry-policy';
import type { ProgressiveContentPage, ProgressiveContentQuery } from './progressive-content-types';

export function useProgressiveContentQuery<T>(props: ProgressiveContentQuery<T>) {
  return useInfiniteQuery<ProgressiveContentPage<T>>({
    queryKey: props.queryKey,
    enabled: props.enabled,
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
}
