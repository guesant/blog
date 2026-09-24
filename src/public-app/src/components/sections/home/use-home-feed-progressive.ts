'use client';

import { useLocale } from '@/i18n/compat';
import { useQuery } from '@tanstack/react-query';
import type { PublicFeedItem } from '@portfolio/data/domain/types';
import type { ContentCollectionMeta } from '@portfolio/data/api/public-site-source-support';
import { getHomeFeedPage } from '@portfolio/data/services';
import { collectionQuery } from '../../../data/queries/content-data-collection-query';
import { contentQueryRetryCount } from '../../../data/queries/content-query-retry-policy';
import { contentQueryStaleTimeMs } from '../../../data/queries/content-query-cache-policy';

type UseHomeFeedProgressiveProps = {
  items: PublicFeedItem[];
  meta: ContentCollectionMeta;
  search: string;
};

export function useHomeFeedProgressive(props: UseHomeFeedProgressiveProps) {
  const locale = useLocale();

  const query = collectionQuery(props.search, 'page', 20);

  const fullPageQuery = { ...query, page: props.meta.page, perPage: 20 };

  const request = useQuery({
    queryKey: ['home-feed', locale, props.search],
    queryFn: () => getHomeFeedPage(locale, fullPageQuery),
    initialData: { items: props.items, meta: props.meta },
    staleTime: contentQueryStaleTimeMs,
    retry: contentQueryRetryCount,
    refetchOnMount: 'always',
  });

  return {
    ...request,
    items: request.data?.items ?? props.items,
    meta: request.data?.meta ?? props.meta,
  };
}
