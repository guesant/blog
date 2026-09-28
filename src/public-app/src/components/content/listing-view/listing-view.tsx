import { ListingViewFrame } from '../../ui';
import type { ListingViewProps } from './types';
import { ListingList } from './listing-list';

export function ListingView<T>(props: ListingViewProps<T>) {
  return (
    <ListingViewFrame>
      <ListingList {...props} />
    </ListingViewFrame>
  );
}
