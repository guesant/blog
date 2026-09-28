'use client';

import { ListingListFrame } from '../../ui';
import type { ListingViewProps } from './types';
import { ListingListItem } from './listing-list-item';

type ListingListProps<T> = ListingViewProps<T>;

export function ListingList<T>(props: ListingListProps<T>) {
  return (
    <ListingListFrame>
      {props.items.map((item) => (
        <ListingListItem
          key={props.getKey(item)}
          item={item}
          getKey={props.getKey}
          renderListItem={props.renderListItem}
        />
      ))}
    </ListingListFrame>
  );
}
