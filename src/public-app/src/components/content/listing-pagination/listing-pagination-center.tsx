'use client';

import { ListingPaginationCenterFrame } from '../../ui/semantic/ListingPaginationCenterFrame';
import { ListingPaginationPageField } from './listing-pagination-page-field';
import type { ListingPaginationProps } from './types';

type ListingPaginationCenterProps = ListingPaginationProps & {
  onNavigate: (page: number) => void;
};

export function ListingPaginationCenter(props: ListingPaginationCenterProps) {
  return (
    <ListingPaginationCenterFrame>
      <ListingPaginationPageField
        value={props.page}
        label={props.pageInputLabel}
        pageCount={props.pageCount}
        onChange={props.onNavigate}
      />
    </ListingPaginationCenterFrame>
  );
}
