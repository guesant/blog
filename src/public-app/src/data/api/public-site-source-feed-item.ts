import type { PublicFeedItem } from '../domain/types';
import { listValue } from './public-site-source-list-value';
import { reference } from './public-site-source-reference';
import { referenceLink } from './public-site-source-reference-link';
import { referencePopularity } from './public-site-source-reference-popularity';
import { stringValue } from './public-site-source-string-value';

export function feedItem(value: Record<string, unknown>): PublicFeedItem {
  const topics = listValue<Record<string, unknown>>(value.topics).map((topic) => ({
    name: stringValue(topic.name ?? topic.slug),
    slug: stringValue(topic.slug) || undefined,
  }));

  const popularity = referencePopularity(value.popularity);

  const sourceReference = value.kind === 'achado' ? reference(value) : undefined;

  return {
    kind: value.kind as PublicFeedItem['kind'],
    slug: stringValue(value.slug),
    title: stringValue(value.title),
    preview: stringValue(value.preview),
    date: stringValue(value.date),
    readingTime: stringValue(value.reading_time) || undefined,
    topics,
    findingType: stringValue(value.finding_type) || undefined,
    popularity,
    featured: value.featured === true,
    links: listValue<Record<string, unknown>>(value.links).map(referenceLink),
    reference: sourceReference,
    href: stringValue(value.href),
  };
}
