import { ListingPagination } from '../listing-pagination';
import type { ContentFeedListingProps } from './content-feed-listing';

type ContentFeedListingPaginationProps = Pick<
  ContentFeedListingProps,
  | 'showPagination'
  | 'page'
  | 'pageCount'
  | 'ariaLabel'
  | 'previousLabel'
  | 'nextLabel'
  | 'pageInputLabel'
  | 'onPageChange'
>;

export function ContentFeedListingPagination(props: ContentFeedListingPaginationProps) {
  if (!props.showPagination) {
    return null;
  }

  return (
    <ListingPagination
      page={props.page}
      pageCount={props.pageCount}
      ariaLabel={props.ariaLabel}
      previousLabel={props.previousLabel}
      nextLabel={props.nextLabel}
      pageInputLabel={props.pageInputLabel}
      onPageChange={props.onPageChange}
    />
  );
}
