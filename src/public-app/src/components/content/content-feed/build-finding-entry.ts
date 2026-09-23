import type { Reference } from '@portfolio/data/domain/types';
import { sourcePreviewEntriesForLink } from '../source-preview/source-preview-entries-for-link';
import { findingDate } from './finding-date';
import { findingPopularityLabel } from './finding-popularity-label';
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
    popularityRank: item.popularity?.rank,
    popularityLabel: findingPopularityLabel(item.popularity),
    featured: item.featured,
    sourcePreviews: item.links.flatMap(sourcePreviewEntriesForLink.bind(null, item)),
    href: `/findings/${item.slug}`,
  };
}
