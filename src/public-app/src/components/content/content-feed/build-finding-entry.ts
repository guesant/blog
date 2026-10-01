import type { Reference } from '@portfolio/data/domain/types';
import { findingDate } from './finding-date';
import { findingPreview } from './finding-preview';
import { findingTopics } from './finding-topics';
import type { FeedEntry } from './types';

export function buildFindingEntry(item: Reference): FeedEntry {
  return {
    kind: 'achado',
    slug: item.slug,
    title: item.title,
    preview: findingPreview(item),
    date: findingDate(item),
    topics: findingTopics(item),
    findingType: item.type,
    featured: item.featured,
    href: item.url ?? `/findings/${item.slug}`,
  };
}
