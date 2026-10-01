'use client';

import { ListingListFrame } from '../../ui';
import type { ListingViewProps } from './types';
import { ListingListItem } from './listing-list-item';

type ListingListProps<T> = ListingViewProps<T>;

export function ListingList<T>(props: ListingListProps<T>) {
  return (
    <ListingListFrame separator={props.separator}>
      {props.items.map((item, index) => (
        <ListingListItem
          key={props.getKey(item)}
          item={item}
          index={index}
          getKey={props.getKey}
          renderListItem={props.renderListItem}
          separator={props.separator}
        />
      ))}
    </ListingListFrame>
  );
}
