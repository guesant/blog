import { ConditionalContent } from '../primitives/conditional-content';
import { ListingFilterActions } from './listing-filter-actions';
import type { ListingFiltersProps } from './listing-filters.types';

type ListingFiltersDefaultActionsProps = Pick<
  ListingFiltersProps,
  'applyLabel' | 'clearLabel' | 'onClear'
>;

export function ListingFiltersDefaultActions(props: ListingFiltersDefaultActionsProps) {
  return (
    <ConditionalContent condition={Boolean(props.onClear && props.applyLabel && props.clearLabel)}>
      <ListingFilterActions
        applyLabel={props.applyLabel ?? ''}
        clearLabel={props.clearLabel}
        onClear={props.onClear}
      />
    </ConditionalContent>
  );
}
