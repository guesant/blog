import type { Reference } from '@portfolio/data/domain/types';

export function findingPopularityLabel(item: Reference['popularity']): string | undefined {
  return item ? `${item.value} ${item.kind}` : undefined;
}
