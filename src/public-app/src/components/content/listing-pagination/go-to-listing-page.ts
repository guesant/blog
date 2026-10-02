import type { ListingPaginationProps } from './types';
import { startProgress } from '../../navigation/start-progress';
import { scrollListingTarget } from './scroll-listing-target';

type GoToListingPageProps = ListingPaginationProps & { nextPage: number };

export function goToListingPage(props: GoToListingPageProps) {
  startProgress();

  const navigation = props.onPageChange(props.nextPage);

  if (navigation && typeof navigation.then === 'function') {
    void navigation.then(
      () => requestAnimationFrame(() => scrollListingTarget(props.scrollTargetId)),
      () => requestAnimationFrame(() => scrollListingTarget(props.scrollTargetId)),
    );
    return;
  }
  requestAnimationFrame(() => scrollListingTarget(props.scrollTargetId));
}
