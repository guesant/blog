import { Box, Stack } from '../ui';
import { ListingFilterActions } from './listing-filter-actions';
import { ConditionalContent } from '../primitives/conditional-content';
import type { ListingFiltersProps } from './listing-filters.types';

type ListingFiltersToolbarProps = ListingFiltersProps;

export function ListingFiltersToolbar(props: ListingFiltersToolbarProps) {
  const defaultActions = (
    <ConditionalContent condition={Boolean(props.onClear && props.applyLabel && props.clearLabel)}>
      <ListingFilterActions
        applyLabel={props.applyLabel ?? ''}
        clearLabel={props.clearLabel}
        onClear={props.onClear}
      />
    </ConditionalContent>
  );

  return (
    <Box component="form" onSubmit={props.onSubmit} visualVariant="listingForm">
      <Stack direction={{ xs: 'column', md: 'row' }} visualVariant="listingToolbarContent">
        {props.children}
        {props.actions !== undefined ? props.actions : defaultActions}
      </Stack>
    </Box>
  );
}
