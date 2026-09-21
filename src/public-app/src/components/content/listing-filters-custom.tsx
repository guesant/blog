import { Box } from '../ui';
import type { ListingFiltersProps } from './listing-filters.types';
import { ListingFiltersDefaultActions } from './listing-filters-default-actions';

type ListingFiltersCustomProps = ListingFiltersProps;

export function ListingFiltersCustom(props: ListingFiltersCustomProps) {
  return (
    <Box component="form" onSubmit={props.onSubmit} visualVariant="listingForm">
      <Box visualVariant="listingCustomContent">
        {props.children}
        {props.actions !== undefined ? props.actions : <ListingFiltersDefaultActions {...props} />}
      </Box>
    </Box>
  );
}
