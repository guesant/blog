import type { ListingFiltersProps } from './listing-filters.types';
import { ListingFiltersDefaultActions } from './listing-filters-default-actions';
import { ListingCustomContentFrame } from '../ui/semantic/ListingCustomContentFrame';
import { ListingFormFrame } from '../ui/semantic/ListingFormFrame';

type ListingFiltersCustomProps = ListingFiltersProps;

export function ListingFiltersCustom(props: ListingFiltersCustomProps) {
  return (
    <ListingFormFrame component="form" onSubmit={props.onSubmit}>
      <ListingCustomContentFrame>
        {props.children}
        {props.actions !== undefined ? props.actions : <ListingFiltersDefaultActions {...props} />}
      </ListingCustomContentFrame>
    </ListingFormFrame>
  );
}
