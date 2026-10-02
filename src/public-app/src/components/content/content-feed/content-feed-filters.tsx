'use client';

import { ListingFilters } from '../listing-filters';
import { ListingFilterActions } from '../listing-filter-actions';
import type { FormEvent } from 'react';
import type { FeedSelectDefinition } from './feed-select.types';
import { FeedSelectControl } from './feed-select-control';
import { FeedSearchField } from './feed-search-field';
import { ContentFeedFiltersFrame } from '../../ui/semantic/ContentFeedFiltersFrame';
import { ConditionalContent } from '../../primitives/conditional-content';

type ContentFeedFiltersProps = {
  selects: FeedSelectDefinition[];
  showSelects: boolean;
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
      <ConditionalContent
        condition={props.showSelects}
        content={props.selects.map((select) => (
          <FeedSelectControl key={select.id} {...select} clearLabel={props.clearLabel} />
        ))}
      />
      <ContentFeedFiltersFrame>
        <FeedSearchField
          value={props.pendingSearch}
          label={props.searchLabel}
          clearLabel={props.clearLabel}
          onChange={props.onPendingSearchChange}
        />
        <ListingFilterActions applyLabel={props.applyLabel} showClear={false} />
      </ContentFeedFiltersFrame>
    </ListingFilters>
  );
}
