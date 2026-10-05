'use client';

import { ListingPaginationCenter } from './listing-pagination-center';
import { ListingPaginationFrame } from '../../ui/semantic/ListingPaginationFrame';
import { ListingPaginationEndSlot } from '../../ui/semantic/ListingPaginationEndSlot';
import { ListingPaginationStartSlot } from '../../ui/semantic/ListingPaginationStartSlot';
import { goToListingPage } from './go-to-listing-page';
import { boundedListingPage } from './bounded-listing-page';
import { ListingPaginationNextButton } from './listing-pagination-next-button';
import { ListingPaginationPreviousButton } from './listing-pagination-previous-button';
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
      <ListingPaginationStartSlot>
        {props.page > 1 ? (
          <ListingPaginationPreviousButton
            label={props.previousLabel}
            onClick={() => onNavigate(props.page - 1)}
          />
        ) : null}
      </ListingPaginationStartSlot>
      <ListingPaginationCenter {...props} onNavigate={onNavigate} />
      <ListingPaginationEndSlot>
        {props.page < props.pageCount ? (
          <ListingPaginationNextButton
            label={props.nextLabel}
            onClick={() => onNavigate(props.page + 1)}
          />
        ) : null}
      </ListingPaginationEndSlot>
    </ListingPaginationFrame>
  );
}
