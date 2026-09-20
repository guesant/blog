import { ChevronRight, LastPage } from '../../ui';
import type { ListingPaginationProps } from './types';
import { goToListingPage } from './go-to-listing-page';
import { ListingPaginationBoundaryButton } from './listing-pagination-boundary-button';

type ListingPaginationEndControlsProps = {
  pagination: ListingPaginationProps;
};

export function ListingPaginationEndControls(props: ListingPaginationEndControlsProps) {
  return (
    <>
      <ListingPaginationBoundaryButton
        onClick={() =>
          goToListingPage({
            ...props.pagination,
            nextPage: Math.min(props.pagination.pageCount, props.pagination.page + 1),
          })
        }
        disabled={props.pagination.page >= props.pagination.pageCount}
        label={props.pagination.nextLabel}
        icon={<ChevronRight fontSize="small" />}
      />
      <ListingPaginationBoundaryButton
        onClick={() =>
          goToListingPage({ ...props.pagination, nextPage: props.pagination.pageCount })
        }
        disabled={props.pagination.page >= props.pagination.pageCount}
        label={props.pagination.lastLabel}
        icon={<LastPage fontSize="small" />}
      />
    </>
  );
}
