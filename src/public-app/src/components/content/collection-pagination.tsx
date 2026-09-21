'use client';

import { useLocation } from '@tanstack/react-router';
import type { ContentCollectionMeta } from '@portfolio/data/api/public-site-source-support';
import { useRouter } from '@/i18n/compat';
import { useContentFeedTranslations } from './content-feed/use-content-feed-translations';
import { ListingPagination } from './listing-pagination';

export type CollectionPaginationProps = {
  meta: ContentCollectionMeta;
  action: string;
  pageParameter?: string;
  scrollTargetId?: string;
};

export function CollectionPagination(props: CollectionPaginationProps) {
  const location = useLocation();

  const router = useRouter();

  const translations = useContentFeedTranslations();

  const onPageChange = (page: number) => {
    const params = new URLSearchParams(location.searchStr);

    params.set(props.pageParameter ?? 'page', String(page));

    return router.push(`${props.action}?${params.toString()}`, { resetScroll: false });
  };

  return (
    <ListingPagination
      page={props.meta.page}
      pageCount={props.meta.lastPage}
      ariaLabel={translations.paginationLabel}
      firstLabel={translations.firstLabel}
      previousLabel={translations.previousLabel}
      nextLabel={translations.nextLabel}
      lastLabel={translations.lastLabel}
      onPageChange={onPageChange}
      scrollTargetId={props.scrollTargetId}
    />
  );
}
