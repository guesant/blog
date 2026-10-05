import { HomeFeedOldestButton } from '../ui/semantic/HomeFeedOldestButton';
import { HomeFeedRecentButton } from '../ui/semantic/HomeFeedRecentButton';
import { goToHomeFeedPage } from './home-feed-pagination-go-to-page';
import type { ListingPageNavigationProps } from './listing-pagination/types';

type HomeFeedPaginationActionsProps = ListingPageNavigationProps & {
  page: number;
  pageCount: number;
  recentLabel: string;
  oldestLabel: string;
};

export function HomeFeedPaginationActions(props: HomeFeedPaginationActionsProps) {
  return (
    <>
      <HomeFeedRecentButton
        type="button"
        variant="outlined"
        disabled={props.page <= 1}
        onClick={() =>
          goToHomeFeedPage({
            onPageChange: props.onPageChange,
            scrollTargetId: props.scrollTargetId,
            nextPage: 1,
          })
        }
      >
        {props.recentLabel}
      </HomeFeedRecentButton>
      <HomeFeedOldestButton
        type="button"
        variant="outlined"
        disabled={props.page >= props.pageCount}
        onClick={() =>
          goToHomeFeedPage({
            onPageChange: props.onPageChange,
            scrollTargetId: props.scrollTargetId,
            nextPage: props.pageCount,
          })
        }
      >
        {props.oldestLabel}
      </HomeFeedOldestButton>
    </>
  );
}
