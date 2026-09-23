import type { ContentCollectionQuery } from '../api/public-site-source-support';

export function contentCollectionQuerySort(value: string | null): ContentCollectionQuery['sort'] {
  return value === 'asc' || value === 'desc' || value === 'alpha' || value === 'popular'
    ? value
    : undefined;
}
