import { ContentFeedResultsState } from './content-feed-results-state';
import { ContentFeedListingPagination } from './content-feed-listing-pagination';
import { ContentFeedStatus } from './content-feed-status';
import type { ContentFeedListingProps } from './content-feed-listing';

type ContentFeedListingResultsProps = Pick<
  ContentFeedListingProps,
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
      <ContentFeedStatus
        count={props.count}
        label={props.t(props.count === 1 ? 'result' : 'results')}
      />
      <ContentFeedListingPagination {...props} />
    </>
  );
}
