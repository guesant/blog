import type { ExternalLink } from '@portfolio/data/domain/types';
import type { FeedEntry } from './types';

export function getFeedCardExternalLink(entry: FeedEntry): ExternalLink | undefined {
  return entry.links?.find((item) => item.isPrimary) ?? entry.links?.[0];
}
