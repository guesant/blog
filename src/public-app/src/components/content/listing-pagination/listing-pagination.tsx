'use client';

import { ListingPaginationCenter } from './listing-pagination-center';
import { ListingPaginationFirstButton } from '../../ui/semantic/ListingPaginationFirstButton';
import { ListingPaginationFrame } from '../../ui/semantic/ListingPaginationFrame';
import { ListingPaginationLastButton } from '../../ui/semantic/ListingPaginationLastButton';
import { goToListingPage } from './go-to-listing-page';
import { boundedListingPage } from './bounded-listing-page';
import type { ListingPaginationProps } from './types';

export function ListingPagination(props: ListingPaginationProps) {
  if (props.pageCount <= 1) {
    return null;
  }

  const onNavigate = (page: number) =>
    goToListingPage({
      ...props,
      nextPage: boundedListingPage(page, props.pageCount),
    });

  return (
    <ListingPaginationFrame component="nav" aria-label={props.ariaLabel}>
      <ListingPaginationFirstButton
        type="button"
        variant="outlined"
        disabled={props.page <= 1}
        aria-label={props.firstLabel}
        onClick={() => onNavigate(1)}
      >
        {props.firstLabel}
      </ListingPaginationFirstButton>
      <ListingPaginationCenter {...props} onNavigate={onNavigate} />
      <ListingPaginationLastButton
        type="button"
        variant="outlined"
        disabled={props.page >= props.pageCount}
        aria-label={props.lastLabel}
        onClick={() => onNavigate(props.pageCount)}
      >
        {props.lastLabel}
      </ListingPaginationLastButton>
    </ListingPaginationFrame>
  );
}
