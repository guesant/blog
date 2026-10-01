import type { ListingFiltersProps } from './listing-filters.types';
import { ListingFiltersDefaultActions } from './listing-filters-default-actions';
import { ListingCustomFilterFieldsFrame } from '../ui/semantic/ListingCustomFilterFieldsFrame';
import { ListingFormFrame } from '../ui/semantic/ListingFormFrame';

type ListingFiltersCustomProps = ListingFiltersProps;

export function ListingFiltersCustom(props: ListingFiltersCustomProps) {
  return (
    <ListingFormFrame component="form" onSubmit={props.onSubmit}>
      <ListingCustomFilterFieldsFrame>
        {props.children}
        {props.actions !== undefined ? props.actions : <ListingFiltersDefaultActions {...props} />}
      </ListingCustomFilterFieldsFrame>
    </ListingFormFrame>
  );
}
