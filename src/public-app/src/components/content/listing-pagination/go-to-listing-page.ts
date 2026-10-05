import type { ListingPageNavigationProps } from './types';
import { startProgress } from '../../navigation/start-progress';

type GoToListingPageProps = ListingPageNavigationProps & { nextPage: number };

export function goToListingPage(props: GoToListingPageProps) {
  startProgress();
  props.onPageChange(props.nextPage);
}
