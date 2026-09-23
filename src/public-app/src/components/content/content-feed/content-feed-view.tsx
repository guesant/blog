'use client';

import type { FormEvent } from 'react';
import { Box } from '../../ui';
import { ContentFeedFilters } from './content-feed-filters';
import { ContentFeedHeader } from './content-feed-header';
import { ContentFeedListing } from './content-feed-listing';
import type { FeedSelectDefinition } from './feed-select.types';
import type { FeedEntry, FeedQuickFilter } from './types';

export type ContentFeedViewProps = {
  copy: { title: string; description: string };
  showHeader: boolean;
  showPagination: boolean;
  selects: FeedSelectDefinition[];
  pendingSearch: string;
  searchLabel: string;
  applyLabel: string;
  clearLabel: string;
  onPendingSearchChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  count: number;
  visibleEntries: FeedEntry[];
  hasActiveFilters: boolean;
  noResultsLabel: string;
  emptyLabel: string;
  locale: string;
  t: (key: string) => string;
  onClear: () => void;
  onQuickFilter: (filter: FeedQuickFilter) => void;
  page: number;
  pageCount: number;
  ariaLabel: string;
  firstLabel: string;
  previousLabel: string;
  nextLabel: string;
  lastLabel: string;
  onPageChange: (page: number) => void;
};

export function ContentFeedView(props: ContentFeedViewProps) {
  return (
    <Box id="content-feed" component="section" visualVariant="feedSection">
      <ContentFeedHeader copy={props.copy} visible={props.showHeader} />
      <ContentFeedFilters
        selects={props.selects}
        pendingSearch={props.pendingSearch}
        searchLabel={props.searchLabel}
        onPendingSearchChange={props.onPendingSearchChange}
        onSubmit={props.onSubmit}
        applyLabel={props.applyLabel}
        clearLabel={props.clearLabel}
      />
      <ContentFeedListing {...props} />
    </Box>
  );
}
