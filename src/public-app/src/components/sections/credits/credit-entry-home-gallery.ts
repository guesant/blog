import type { CreditEntry, HomeGalleryEntry } from '@portfolio/data/domain/types';

export function creditEntryToHomeGalleryEntry(entry: CreditEntry): HomeGalleryEntry {
  return {
    kind: 'credits',
    slug: `${entry.category}-${entry.url}-${entry.name}`,
    title: entry.name,
    description: entry.description,
    href: entry.url,
    category: entry.category,
  };
}
