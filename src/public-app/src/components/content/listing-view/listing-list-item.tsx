'use client';

import { Fragment, type ReactNode } from 'react';

type ListingListItemProps<T> = {
  item: T;
  index: number;
  getKey: (item: T) => string;
  renderListItem: (item: T) => ReactNode;
  separator?: ReactNode;
};

export function ListingListItem<T>(props: ListingListItemProps<T>) {
  const { item, getKey, renderListItem } = props;

  return (
    <Fragment key={getKey(item)}>
      {props.index > 0 ? props.separator : null}
      {renderListItem(item)}
    </Fragment>
  );
}
