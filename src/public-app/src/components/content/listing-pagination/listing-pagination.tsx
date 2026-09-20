'use client';

import { Stack } from '../../ui';
import { paginationItems, type ListingPaginationProps } from './types';
import { PaginationPageButton } from './pagination-page-button';
import { ListingPaginationStartControls } from './listing-pagination-start-controls';
import { ListingPaginationEndControls } from './listing-pagination-end-controls';

export function ListingPagination(props: ListingPaginationProps) {
  const { page, pageCount, ariaLabel } = props;

  if (pageCount <= 1) {
    return null;
  }

  return (
    <Stack
      component="nav"
      aria-label={ariaLabel}
      direction={{ xs: 'column', sm: 'row' }}
      visualVariant="listingPagination"
    >
      <ListingPaginationStartControls pagination={props} />
      {paginationItems(page, pageCount).map((value, index) => (
        <PaginationPageButton
          key={value === 'ellipsis' ? `ellipsis-${index}` : value}
          value={value}
          page={page}
          goToPage={props.onPageChange}
        />
      ))}
      <ListingPaginationEndControls pagination={props} />
    </Stack>
  );
}
