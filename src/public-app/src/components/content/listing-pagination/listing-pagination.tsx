'use client';

import { Pagination } from '../../ui';
import { listingPaginationAriaLabel } from './listing-pagination-aria-label';
import type { ListingPaginationProps } from './types';
import { goToListingPage } from './go-to-listing-page';

export function ListingPagination(props: ListingPaginationProps) {
  if (props.pageCount <= 1) {
    return null;
  }

  return (
    <Pagination
      count={props.pageCount}
      page={props.page}
      aria-label={props.ariaLabel}
      visualVariant="listingPagination"
      variant="outlined"
      shape="rounded"
      size="small"
      showFirstButton
      showLastButton
      boundaryCount={2}
      siblingCount={1}
      onChange={(_event, nextPage) =>
        goToListingPage({ ...props, nextPage: nextPage ?? props.page })
      }
      getItemAriaLabel={(type, page) =>
        listingPaginationAriaLabel({
          type,
          page: page ?? props.page,
          ariaLabel: props.ariaLabel,
          firstLabel: props.firstLabel,
          previousLabel: props.previousLabel,
          nextLabel: props.nextLabel,
          lastLabel: props.lastLabel,
        })
      }
    />
  );
}
