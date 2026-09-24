import type { HomeGallery, HomeGalleryEntryKind } from '../domain/pages-content';
import { homeGalleryFeedKind } from './public-site-source-home-gallery-feed-kind';
import { homeGalleryEntry } from './public-site-source-home-gallery-entry';
import { objectValue } from './public-site-source-object-value';
import { recordList } from './public-site-source-list';
import { stringValue } from './public-site-source-string-value';
import type { RecordValue } from './public-site-source-support';

export function parseHomeGallery(value: unknown): HomeGallery {
  const payload = objectValue(value) ?? {};

  const recent = objectValue(payload.recent) ?? {};

  return {
    highlights: recordList<RecordValue>(payload.highlights).map((entry) => {
      const item = objectValue(entry.item) ?? {};

      const kind = stringValue(entry.kind) as HomeGalleryEntryKind;

      return homeGalleryEntry(item, kind);
    }),
    recent: [
      ...recordList<RecordValue>(recent.feed).map((item) => {
        const kind = stringValue(item.kind);

        const entryKind = homeGalleryFeedKind(kind);

        return homeGalleryEntry(item, entryKind);
      }),
      ...recordList<RecordValue>(recent.projects).map((item) => homeGalleryEntry(item, 'projects')),
    ],
    popular: recordList<RecordValue>(payload.popular).map((item) =>
      homeGalleryEntry(item, 'finding'),
    ),
    collections: recordList<RecordValue>(payload.collections).map((item) =>
      homeGalleryEntry(item, 'collection'),
    ),
    projects: recordList<RecordValue>(payload.projects).map((item) =>
      homeGalleryEntry(item, 'projects'),
    ),
  };
}
