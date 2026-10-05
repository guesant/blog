import { ListingPagination } from '../listing-pagination';
import { HomeFeedPagination } from '../home-feed-pagination';
import type { ContentFeedListingProps } from './content-feed-listing';

type ContentFeedListingPaginationProps = Pick<
  ContentFeedListingProps,
  | 'showPagination'
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
>;

export function ContentFeedListingPagination(props: ContentFeedListingPaginationProps) {
  if (!props.showPagination) {
    return null;
  }

  if (props.paginationMode === 'home') {
    return (
      <HomeFeedPagination
        page={props.page}
        pageCount={props.pageCount}
        ariaLabel={props.ariaLabel}
        recentLabel={props.recentLabel ?? props.firstLabel}
        oldestLabel={props.oldestLabel ?? props.lastLabel}
        onPageChange={props.onPageChange}
        scrollTargetId="content-feed"
      />
    );
  }

  return (
    <ListingPagination
      page={props.page}
      pageCount={props.pageCount}
      ariaLabel={props.ariaLabel}
      firstLabel={props.firstLabel}
      previousLabel={props.previousLabel}
      nextLabel={props.nextLabel}
      lastLabel={props.lastLabel}
      pageInputLabel={props.pageInputLabel}
      pageOfLabel={props.pageOfLabel}
      onPageChange={props.onPageChange}
      scrollTargetId="content-feed"
    />
  );
}
