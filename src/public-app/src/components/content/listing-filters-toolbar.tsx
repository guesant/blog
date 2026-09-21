import { Box, Stack } from '../ui';
import type { ListingFiltersProps } from './listing-filters.types';
import { ListingFiltersDefaultActions } from './listing-filters-default-actions';

type ListingFiltersToolbarProps = ListingFiltersProps;

export function ListingFiltersToolbar(props: ListingFiltersToolbarProps) {
  return (
    <Box component="form" onSubmit={props.onSubmit} visualVariant="listingForm">
      <Stack direction={{ xs: 'column', md: 'row' }} visualVariant="listingToolbarContent">
        {props.children}
        {props.actions !== undefined ? props.actions : <ListingFiltersDefaultActions {...props} />}
      </Stack>
    </Box>
  );
}
