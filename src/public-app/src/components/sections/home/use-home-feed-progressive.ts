'use client';

import { useLocale } from '@/i18n/compat';
import type { PublicFeedItem } from '@portfolio/data/domain/types';
import type { ContentCollectionMeta } from '@portfolio/data/api/public-site-source-support';
import { getHomeFeedPage } from '@portfolio/data/services';
import { collectionQuery } from '../../../data/queries/content-data-collection-query';
import { useProgressiveContent } from '../../../data/queries/use-progressive-content';
import { feedItemKey } from './feed-item-key';

type UseHomeFeedProgressiveProps = {
  items: PublicFeedItem[];
  meta: ContentCollectionMeta;
  search: string;
};

export function useHomeFeedProgressive(props: UseHomeFeedProgressiveProps) {
  const locale = useLocale();

  const query = collectionQuery(props.search, 'page', 6);

  return useProgressiveContent<PublicFeedItem>({
    initialPage: { items: props.items, meta: props.meta },
    queryKey: ['home-feed', locale, props.search],
    getKey: feedItemKey,
    loadPage: (page) => getHomeFeedPage(locale, { ...query, page }),
  });
}
