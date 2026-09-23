'use client';

import { ExploreSection } from './explore-section';
import { ContentFeedResultsState } from './content-feed-results-state';
import { ContentFeedStatus } from './content-feed-status';
import { ListingPagination } from '../listing-pagination';
import type { ContentFeedViewProps } from './content-feed-view';

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
>;

export function ContentFeedListing(props: ContentFeedListingProps) {
  return (
    <>
      <ContentFeedStatus count={props.count} label={props.t('results')} />
      <ContentFeedResultsState
        entries={props.visibleEntries}
        hasActiveFilters={props.hasActiveFilters}
        noResultsLabel={props.noResultsLabel}
        emptyLabel={props.emptyLabel}
        clearLabel={props.clearLabel}
        onClear={props.onClear}
        locale={props.locale}
        t={props.t}
        onQuickFilter={props.onQuickFilter}
      />
      <ListingPagination
        page={props.page}
        pageCount={props.pageCount}
        ariaLabel={props.ariaLabel}
        firstLabel={props.firstLabel}
        previousLabel={props.previousLabel}
        nextLabel={props.nextLabel}
        lastLabel={props.lastLabel}
        onPageChange={props.onPageChange}
        scrollTargetId="content-feed"
      />
      <ExploreSection />
    </>
  );
}
