import { Stack } from '../../ui';
import type { ListingViewProps } from './types';
import { ListingList } from './listing-list';

export function ListingView<T>(props: ListingViewProps<T>) {
  return (
    <Stack visualVariant="listingView">
      <ListingList {...props} />
    </Stack>
  );
}
