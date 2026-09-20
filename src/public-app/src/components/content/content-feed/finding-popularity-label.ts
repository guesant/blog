import type { Reference } from '@portfolio/data/domain/types';

export function findingPopularityLabel(item: Reference): string | undefined {
  if (!item.popularity) {
    return undefined;
  }

  return `${item.popularity.value} ${item.popularity.kind}`;
}
