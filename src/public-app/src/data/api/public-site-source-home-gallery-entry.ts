import type { HomeGalleryEntry, HomeGalleryEntryKind } from '../domain/pages-content';
import { stringValue } from './public-site-source-string-value';
import type { RecordValue } from './public-site-source-support';

export function homeGalleryEntry(
  source: RecordValue,
  kind: HomeGalleryEntryKind,
): HomeGalleryEntry {
  return {
    ...source,
    kind,
    slug: stringValue(source.slug),
    title: stringValue(source.gallery_title),
    description: stringValue(source.gallery_description),
    href: stringValue(source.href),
  };
}
