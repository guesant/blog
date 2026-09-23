'use client';

import { useEffect, useRef } from 'react';

type UseProgressiveCollectionSentinelProps = {
  enabled: boolean;
  onLoadMore: () => void;
};

export function useProgressiveCollectionSentinel(props: UseProgressiveCollectionSentinelProps) {
  const sentinelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = sentinelRef.current;

    if (!node || !props.enabled) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          props.onLoadMore();
        }
      },
      { rootMargin: '25%' },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [props.enabled, props.onLoadMore]);

  return sentinelRef;
}
