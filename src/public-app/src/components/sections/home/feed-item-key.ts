import type { PublicFeedItem } from '@portfolio/data/domain/types';

export function feedItemKey(item: PublicFeedItem): string {
  return `${item.kind}-${item.slug}`;
}
