'use client';

import { ListingPaginationCenterFrame } from '../../ui/semantic/ListingPaginationCenterFrame';
import { ListingPaginationPageField } from './listing-pagination-page-field';
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
      <ListingPaginationPageField
        value={input.inputValue}
        label={props.pageInputLabel}
        pageCount={props.pageCount}
        pageOfLabel={props.pageOfLabel}
        onChange={input.onChange}
        onBlur={input.commit}
      />
    </ListingPaginationCenterFrame>
  );
}
