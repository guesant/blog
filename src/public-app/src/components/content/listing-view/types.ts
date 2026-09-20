import type { ReactNode } from 'react';

export type ListingViewProps<T> = {
  items: T[];
  getKey: (item: T) => string;
  renderListItem: (item: T) => ReactNode;
};
