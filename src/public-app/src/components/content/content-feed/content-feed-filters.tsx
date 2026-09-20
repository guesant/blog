'use client';

import { Box } from '../../ui';
import { ListingFilters } from '../listing-filters';
import { ListingFilterActions } from '../listing-filter-actions';
import type { FormEvent } from 'react';
import type { FeedSelectDefinition } from './feed-select.types';
import { FeedSelectControl } from './feed-select-control';
import { FeedSearchField } from './feed-search-field';

type ContentFeedFiltersProps = {
  selects: FeedSelectDefinition[];
  pendingSearch: string;
  searchLabel: string;
  applyLabel: string;
  clearLabel: string;
  onPendingSearchChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function ContentFeedFilters(props: ContentFeedFiltersProps) {
  return (
    <ListingFilters
      layout="toolbar"
      actions={null}
      onSubmit={props.onSubmit}
      applyLabel={props.applyLabel}
      clearLabel={props.clearLabel}
    >
      {props.selects.map((select) => (
        <FeedSelectControl key={select.id} {...select} clearLabel={props.clearLabel} />
      ))}
      <Box visualVariant="contentFeedFilters">
        <FeedSearchField
          value={props.pendingSearch}
          label={props.searchLabel}
          clearLabel={props.clearLabel}
          onChange={props.onPendingSearchChange}
        />
        <ListingFilterActions applyLabel={props.applyLabel} showClear={false} />
      </Box>
    </ListingFilters>
  );
}
