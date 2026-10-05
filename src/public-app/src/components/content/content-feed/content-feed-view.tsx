'use client';

import type { FormEvent, ReactNode } from 'react';
import { ContentFeedSectionFrame } from '../../ui/semantic/ContentFeedSectionFrame';
import { ContentFeedFilters } from './content-feed-filters';
import { ContentFeedHeader } from './content-feed-header';
import { ContentFeedListing } from './content-feed-listing';
import type { FeedSelectDefinition } from './feed-select.types';
import type { FeedEntry, FeedPageCopy, FeedQuickFilter } from './types';
import type { BreadcrumbItem } from '../../navigation/breadcrumbs';
import type { AchadosTranslator } from '@/i18n/compat-support';

export type ContentFeedViewProps = {
  copy: FeedPageCopy;
  breadcrumbs?: BreadcrumbItem[];
  showHeader: boolean;
  showPagination: boolean;
  selects: FeedSelectDefinition[];
  showSelects: boolean;
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
  t: AchadosTranslator;
  onClear: () => void;
  onQuickFilter: (filter: FeedQuickFilter) => void;
  page: number;
  pageCount: number;
  ariaLabel: string;
  previousLabel: string;
  nextLabel: string;
  pageInputLabel: string;
  pageOfLabel: string;
  onPageChange: (page: number) => void;
  beforeExplore?: ReactNode;
};

export function ContentFeedView(props: ContentFeedViewProps) {
  return (
    <ContentFeedSectionFrame id="content-feed">
      <ContentFeedHeader {...props} visible={props.showHeader} />
      <ContentFeedFilters
        selects={props.selects}
        showSelects={props.showSelects}
        pendingSearch={props.pendingSearch}
        searchLabel={props.searchLabel}
        onPendingSearchChange={props.onPendingSearchChange}
        onSubmit={props.onSubmit}
        applyLabel={props.applyLabel}
        clearLabel={props.clearLabel}
      />
      <ContentFeedListing {...props} />
    </ContentFeedSectionFrame>
  );
}
