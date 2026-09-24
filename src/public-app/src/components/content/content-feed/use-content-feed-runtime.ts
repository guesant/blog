'use client';

import { useLocale } from '@/i18n/compat';
import { useLocation } from '@tanstack/react-router';
import { useMemo } from 'react';
import { useRouter } from '../../../i18n/compat';
import type { ContentFeedProps } from './types';
import { useContentFeedActions } from './use-content-feed-actions';
import { useContentFeedData } from './use-content-feed-data';
import { useContentFeedProgressive } from './use-content-feed-progressive';
import { useContentFeedState } from './use-content-feed-state';
import { useContentFeedTranslations } from './use-content-feed-translations';

export function useContentFeedRuntime(props: ContentFeedProps) {
  const locale = useLocale();

  const router = useRouter();

  const translations = useContentFeedTranslations();

  const searchString = useLocation({ select: (location) => location.searchStr });

  const query = useMemo(() => new URLSearchParams(searchString), [searchString]);

  const state = useContentFeedState({ ...props, query });

  const progressive = useContentFeedProgressive({
    ...props,
    ...state,
    locale,
    query,
    displayMode: state.displayMode,
  });

  const data = useContentFeedData({
    ...props,
    ...state,
    query,
    ...(props.feedItems ? { feedItems: progressive.items, contentMeta: progressive.meta } : {}),
  });

  const actions = useContentFeedActions({ ...state, ...props, query, router });

  return { locale, router, translations, query, state, data, actions, progressive };
}
