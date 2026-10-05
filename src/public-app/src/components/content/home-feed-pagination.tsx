'use client';

import { HomeFeedPaginationFrame } from '../ui/semantic/HomeFeedPaginationFrame';
import { HomeFeedPaginationActions } from './home-feed-pagination-actions';
import type { ListingPageNavigationProps } from './listing-pagination/types';

type HomeFeedPaginationProps = ListingPageNavigationProps & {
  page: number;
  pageCount: number;
  ariaLabel: string;
  recentLabel: string;
  oldestLabel: string;
};

export function HomeFeedPagination(props: HomeFeedPaginationProps) {
  if (props.pageCount <= 1) {
    return null;
  }

  return (
    <HomeFeedPaginationFrame component="nav" aria-label={props.ariaLabel}>
      <HomeFeedPaginationActions {...props} />
    </HomeFeedPaginationFrame>
  );
}
