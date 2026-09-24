import type { Reference, ReferenceCollection, Writing } from '@portfolio/data/domain/types';
import { buildFindingEntries } from './build-finding-entries';
import { dateValue } from './date-value';
import type { FeedEntry } from './types';

export function buildEntries(
  writings: Writing[],
  findings: Reference[],
  collections: ReferenceCollection[],
): FeedEntry[] {
  return [
    ...writings.map((item) => ({
      kind: 'post' as const,
      slug: item.slug,
      title: item.title,
      preview: item.excerpt,
      date: dateValue(item.dateISO),
      readingTime: item.readingTime,
      topics: item.tags.map((name, index) => ({
        name,
        slug: item.topicSlugs?.[index],
        url: item.topicUrls?.[index],
      })),
      href: item.url ?? `/writing/${item.slug}`,
    })),
    ...buildFindingEntries(findings),
    ...collections.map((item) => ({
      kind: 'colecao' as const,
      slug: item.slug,
      title: item.title,
      preview: item.description,
      date: '',
      topics: [],
      href: item.url ?? `/collections/${item.slug}`,
    })),
  ];
}
