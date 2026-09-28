import type { ListingFiltersProps } from './listing-filters.types';
import { ListingFiltersDefaultActions } from './listing-filters-default-actions';
import { ListingFormFrame } from '../ui/semantic/ListingFormFrame';
import { ListingToolbarContentStack } from '../ui/semantic/ListingToolbarContentStack';

type ListingFiltersToolbarProps = ListingFiltersProps;

export function ListingFiltersToolbar(props: ListingFiltersToolbarProps) {
  return (
    <ListingFormFrame component="form" onSubmit={props.onSubmit}>
      <ListingToolbarContentStack direction={{ xs: 'column', md: 'row' }}>
        {props.children}
        {props.actions !== undefined ? props.actions : <ListingFiltersDefaultActions {...props} />}
      </ListingToolbarContentStack>
    </ListingFormFrame>
  );
}
