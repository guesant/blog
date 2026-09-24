import { ConditionalContent } from '../../primitives/conditional-content';
import { ContentFeedResultsState } from './content-feed-results-state';
import { ListingPagination } from '../listing-pagination';
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
      <ConditionalContent
        condition={props.showPagination}
        content={
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
        }
      />
    </>
  );
}
