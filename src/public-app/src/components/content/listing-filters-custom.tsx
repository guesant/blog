import { Box } from '../ui';
import { ListingFilterActions } from './listing-filter-actions';
import { ConditionalContent } from '../primitives/conditional-content';
import type { ListingFiltersProps } from './listing-filters.types';

type ListingFiltersCustomProps = ListingFiltersProps;

export function ListingFiltersCustom(props: ListingFiltersCustomProps) {
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
      <Box visualVariant="listingCustomContent">
        {props.children}
        {props.actions !== undefined ? props.actions : defaultActions}
      </Box>
    </Box>
  );
}
