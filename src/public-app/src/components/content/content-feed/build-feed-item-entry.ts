import { dateValue } from './date-value';
import type { FeedEntry } from './types';
import type { PublicFeedItem } from '@portfolio/data/domain/types';

export function buildFeedItemEntry(item: PublicFeedItem): FeedEntry {
  return {
    kind: item.kind,
    slug: item.slug,
    title: item.title,
    preview: item.preview,
    date: dateValue(item.date),
    readingTime: item.readingTime,
    topics: item.topics,
    href: item.href,
  };
}
