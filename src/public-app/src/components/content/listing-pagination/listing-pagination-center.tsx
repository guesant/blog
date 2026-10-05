'use client';

import { ListingPaginationCenterFrame } from '../../ui/semantic/ListingPaginationCenterFrame';
import { ListingPaginationNextButton } from './listing-pagination-next-button';
import { ListingPaginationPageField } from './listing-pagination-page-field';
import { ListingPaginationPreviousButton } from './listing-pagination-previous-button';
import { useListingPaginationInput } from './use-listing-pagination-input';
import type { ListingPaginationProps } from './types';

type ListingPaginationCenterProps = ListingPaginationProps & {
  onNavigate: (page: number) => void;
};

export function ListingPaginationCenter(props: ListingPaginationCenterProps) {
  const input = useListingPaginationInput({
    page: props.page,
    pageCount: props.pageCount,
    onNavigate: props.onNavigate,
  });

  return (
    <ListingPaginationCenterFrame component="form" noValidate onSubmit={input.onSubmit}>
      <ListingPaginationPreviousButton
        disabled={props.page <= 1}
        label={props.previousLabel}
        onClick={() => props.onNavigate(props.page - 1)}
      />
      <ListingPaginationPageField
        value={input.inputValue}
        label={props.pageInputLabel}
        pageCount={props.pageCount}
        pageOfLabel={props.pageOfLabel}
        onChange={input.onChange}
        onBlur={input.commit}
      />
      <ListingPaginationNextButton
        disabled={props.page >= props.pageCount}
        label={props.nextLabel}
        onClick={() => props.onNavigate(props.page + 1)}
      />
    </ListingPaginationCenterFrame>
  );
}
