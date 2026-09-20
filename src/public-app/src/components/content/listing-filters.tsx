'use client';

import { ListingFiltersCustom } from './listing-filters-custom';
import { ListingFiltersToolbar } from './listing-filters-toolbar';
import type { ListingFiltersProps } from './listing-filters.types';

export function ListingFilters(props: ListingFiltersProps) {
  if (props.layout === 'custom') {
    return <ListingFiltersCustom {...props} />;
  }

  return <ListingFiltersToolbar {...props} />;
}
