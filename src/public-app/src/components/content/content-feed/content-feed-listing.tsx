'use client';

import { ExploreSection } from './explore-section';
import { ContentFeedStatus } from './content-feed-status';
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
  | 'ariaLabel'
  | 'firstLabel'
  | 'previousLabel'
  | 'nextLabel'
  | 'lastLabel'
  | 'onPageChange'
  | 'showPagination'
  | 'displayMode'
  | 'progressive'
  | 'beforeExplore'
>;

export function ContentFeedListing(props: ContentFeedListingProps) {
  return (
    <>
      <ContentFeedStatus count={props.count} label={props.t('results')} />
      <ContentFeedListingResults {...props} />
      <>
        {props.beforeExplore}
        <ExploreSection />
      </>
    </>
  );
}
