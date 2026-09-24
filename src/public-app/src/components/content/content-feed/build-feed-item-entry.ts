import { buildFindingEntry } from './build-finding-entry';
import { dateValue } from './date-value';
import { findingPopularityLabel } from './finding-popularity-label';
import type { FeedEntry } from './types';
import type { PublicFeedItem } from '@portfolio/data/domain/types';

export function buildFeedItemEntry(item: PublicFeedItem): FeedEntry {
  if (item.reference) {
    return buildFindingEntry(item.reference);
  }

  return {
    kind: item.kind,
    slug: item.slug,
    title: item.title,
    preview: item.preview,
    date: dateValue(item.date),
    readingTime: item.readingTime,
    topics: item.topics,
    findingType: item.findingType,
    popularityRank: item.popularity?.rank,
    popularityLabel: item.popularity ? findingPopularityLabel(item.popularity) : undefined,
    featured: item.featured,
    href: item.href,
  };
}
