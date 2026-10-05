'use client';

import { ExploreSection } from './explore-section';
import type { ContentFeedViewProps } from './content-feed-view';
import { ContentFeedListingResults } from './content-feed-listing-results';

export type ContentFeedListingProps = Pick<
  ContentFeedViewProps,
  | 'count'
  | 'visibleEntries'
  | 'hasActiveFilters'
  | 'noResultsLabel'
  | 'emptyLabel'
  | 'clearLabel'
  | 'onClear'
  | 'locale'
  | 't'
  | 'onQuickFilter'
  | 'page'
  | 'pageCount'
  | 'paginationMode'
  | 'recentLabel'
  | 'oldestLabel'
  | 'ariaLabel'
  | 'firstLabel'
  | 'previousLabel'
  | 'nextLabel'
  | 'lastLabel'
  | 'pageInputLabel'
  | 'pageOfLabel'
  | 'onPageChange'
  | 'showPagination'
  | 'beforeExplore'
>;

export function ContentFeedListing(props: ContentFeedListingProps) {
  return (
    <>
      <ContentFeedListingResults {...props} />
      <>
        {props.beforeExplore}
        <ExploreSection />
      </>
    </>
  );
}
