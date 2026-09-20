'use client';

import { Box } from '../../ui';
import type { ReactNode } from 'react';

type ListingListItemProps<T> = {
  item: T;
  getKey: (item: T) => string;
  renderListItem: (item: T) => ReactNode;
};

export function ListingListItem<T>(props: ListingListItemProps<T>) {
  const { item, getKey, renderListItem } = props;

  return <Box key={getKey(item)}>{renderListItem(item)}</Box>;
}
