'use client';

import { Button, Stack } from '../../ui';
import { EmptyState } from '../empty-state';
import { ConditionalContent } from '../../primitives/conditional-content';

type ContentFeedEmptyProps = {
  hasActiveFilters: boolean;
  emptyLabel: string;
  noResultsLabel: string;
  clearLabel: string;
  onClear: () => void;
};

export function ContentFeedEmpty(props: ContentFeedEmptyProps) {
  return (
    <Stack visualVariant="contentFeedEmpty">
      <EmptyState>{props.hasActiveFilters ? props.noResultsLabel : props.emptyLabel}</EmptyState>
      <ConditionalContent condition={props.hasActiveFilters}>
        <Button type="button" onClick={props.onClear} variant="outlined" size="small">
          {props.clearLabel}
        </Button>
      </ConditionalContent>
    </Stack>
  );
}
