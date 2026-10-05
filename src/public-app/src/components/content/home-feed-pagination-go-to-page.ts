import { goToListingPage } from './listing-pagination/go-to-listing-page';
import type { ListingPageNavigationProps } from './listing-pagination/types';

type HomeFeedPageChangeProps = ListingPageNavigationProps & { nextPage: number };

export function goToHomeFeedPage(props: HomeFeedPageChangeProps) {
  return goToListingPage(props);
}
