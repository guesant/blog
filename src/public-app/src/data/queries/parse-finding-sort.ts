import type { FindingListQuery } from '@portfolio/data/services';

export function parseFindingSort(value: string | null): FindingListQuery['sort'] {
  const allowed = new Set(['asc', 'desc', 'alpha', 'popular']);

  return allowed.has(value ?? '') ? (value as FindingListQuery['sort']) : 'desc';
}
