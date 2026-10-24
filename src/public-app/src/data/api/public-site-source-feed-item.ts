import type { PublicFeedItem } from '../domain/types';
import { listValue } from './public-site-source-list-value';
import { stringValue } from './public-site-source-string-value';

export function feedItem(value: Record<string, unknown>): PublicFeedItem {
  const topics = listValue<Record<string, unknown>>(value.topics).map((topic) => ({
    name: stringValue(topic.name ?? topic.slug),
    slug: stringValue(topic.slug) || undefined,
    url: stringValue(topic.url) || undefined,
  }));

  return {
    kind: value.kind as PublicFeedItem['kind'],
    slug: stringValue(value.slug),
    title: stringValue(value.title),
    preview: stringValue(value.preview),
    date: stringValue(value.date),
    readingTime: stringValue(value.reading_time) || undefined,
    topics,
    href: stringValue(value.href),
  };
}
