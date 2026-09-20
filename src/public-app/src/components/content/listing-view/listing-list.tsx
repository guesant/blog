'use client';

import { Stack } from '../../ui';
import type { ListingViewProps } from './types';
import { ListingListItem } from './listing-list-item';

type ListingListProps<T> = ListingViewProps<T>;

export function ListingList<T>(props: ListingListProps<T>) {
  return (
    <Stack visualVariant="listingList">
      {props.items.map((item) => (
        <ListingListItem
          key={props.getKey(item)}
          item={item}
          getKey={props.getKey}
          renderListItem={props.renderListItem}
        />
      ))}
    </Stack>
  );
}
