'use client';

import { listingPaginationAriaLabel } from './listing-pagination-aria-label';
import type { ListingPaginationProps } from './types';
import type { ChangeEvent } from 'react';
import { goToListingPage } from './go-to-listing-page';
import { ListingPaginationControl } from '../../ui/semantic/ListingPaginationControl';

export function ListingPagination(props: ListingPaginationProps) {
  if (props.pageCount <= 1) {
    return null;
  }

  return (
    <ListingPaginationControl
      count={props.pageCount}
      page={props.page}
      aria-label={props.ariaLabel}

      variant="outlined"
      shape="rounded"
      size="small"
      showFirstButton
      showLastButton
      boundaryCount={2}
      siblingCount={1}
      onChange={(_event: ChangeEvent<unknown>, nextPage: number) =>
        goToListingPage({ ...props, nextPage: nextPage ?? props.page })
      }
      getItemAriaLabel={(type: string, page: number | null) =>
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
