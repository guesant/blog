import type { SortMode } from './types';

export function contentFeedQuerySort(sort: SortMode) {
  if (sort === 'desc') {
    return '';
  }
  return sort;
}
