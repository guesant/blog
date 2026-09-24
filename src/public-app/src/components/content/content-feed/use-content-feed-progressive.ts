'use client';

import { useCallback, useMemo } from 'react';
import { useProgressiveContent } from '../../../data/queries/use-progressive-content';
import { buildContentFeedProgressivePage } from './build-content-feed-progressive-page';
import { loadContentFeedProgressivePage } from './load-content-feed-progressive-page';
import type { ContentFeedProgressiveProps } from './use-content-feed-progressive.types';

export function useContentFeedProgressive(props: ContentFeedProgressiveProps) {
  const initialPage = useMemo(
    () => buildContentFeedProgressivePage(props),
    [props.contentMeta, props.feedItems, props.locale, props.perPage],
  );

  const loadPage = useCallback(
    (page: number) => loadContentFeedProgressivePage(props, page),
    [
      props.fixedKind,
      props.kind,
      props.locale,
      props.perPage,
      props.search,
      props.sort,
      props.topic,
      props.type,
    ],
  );

  return useProgressiveContent({
    enabled: props.displayMode === 'infinite',
    initialPage,
    queryKey: ['content-feed', props.action, props.locale, props.query.toString()],
    loadPage,
    getKey: (item) => `${item.kind}-${item.slug}`,
  });
}
