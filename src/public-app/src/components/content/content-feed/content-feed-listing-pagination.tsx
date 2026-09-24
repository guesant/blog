import { ConditionalContent } from '../../primitives/conditional-content';
import { ListingPagination } from '../listing-pagination';
import type { ContentFeedListingProps } from './content-feed-listing';

type ContentFeedListingPaginationProps = Pick<
  ContentFeedListingProps,
  | 'showPagination'
  | 'page'
  | 'pageCount'
  | 'ariaLabel'
  | 'firstLabel'
  | 'previousLabel'
  | 'nextLabel'
  | 'lastLabel'
  | 'onPageChange'
>;

export function ContentFeedListingPagination(props: ContentFeedListingPaginationProps) {
  return (
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
  );
}
