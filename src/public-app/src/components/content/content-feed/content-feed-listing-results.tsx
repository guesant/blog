import { ContentFeedResultsState } from './content-feed-results-state';
import { ContentFeedListingPagination } from './content-feed-listing-pagination';
import { ContentFeedListingProgressive } from './content-feed-listing-progressive';
import type { ContentFeedListingProps } from './content-feed-listing';

type ContentFeedListingResultsProps = Pick<
  ContentFeedListingProps,
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
>;

export function ContentFeedListingResults(props: ContentFeedListingResultsProps) {
  return (
    <>
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
      <ContentFeedListingPagination {...props} />
      <ContentFeedListingProgressive {...props} />
    </>
  );
}
