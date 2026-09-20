import { ChevronLeft, FirstPage } from '../../ui';
import type { ListingPaginationProps } from './types';
import { goToListingPage } from './go-to-listing-page';
import { ListingPaginationBoundaryButton } from './listing-pagination-boundary-button';

type ListingPaginationStartControlsProps = {
  pagination: ListingPaginationProps;
};

export function ListingPaginationStartControls(props: ListingPaginationStartControlsProps) {
  return (
    <>
      <ListingPaginationBoundaryButton
        onClick={() => goToListingPage({ ...props.pagination, nextPage: 1 })}
        disabled={props.pagination.page <= 1}
        label={props.pagination.firstLabel}
        icon={<FirstPage fontSize="small" />}
      />
      <ListingPaginationBoundaryButton
        onClick={() =>
          goToListingPage({
            ...props.pagination,
            nextPage: Math.max(1, props.pagination.page - 1),
          })
        }
        disabled={props.pagination.page <= 1}
        label={props.pagination.previousLabel}
        icon={<ChevronLeft fontSize="small" />}
      />
    </>
  );
}
