import type { HomeGalleryFeedCategories } from '../domain/pages-content';
import { homeGalleryEntry } from './public-site-source-home-gallery-entry';
import { objectValue } from './public-site-source-object-value';
import { recordList } from './public-site-source-list';
import type { RecordValue } from './public-site-source-support';

export function parseHomeGalleryFeedCategories(value: unknown): HomeGalleryFeedCategories {
  const payload = objectValue(value) ?? {};

  return {
    writing: recordList<RecordValue>(payload.writing).map((item) =>
      homeGalleryEntry(item, 'writing'),
    ),
    finding: recordList<RecordValue>(payload.finding).map((item) =>
      homeGalleryEntry(item, 'finding'),
    ),
    collection: recordList<RecordValue>(payload.collection).map((item) =>
      homeGalleryEntry(item, 'collection'),
    ),
  };
}
