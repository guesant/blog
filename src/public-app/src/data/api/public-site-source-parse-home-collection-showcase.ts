import type { HomeCollectionShowcase } from '../domain/pages-content';
import { homeGalleryFeedKind } from './public-site-source-home-gallery-feed-kind';
import { homeGalleryEntry } from './public-site-source-home-gallery-entry';
import { objectValue } from './public-site-source-object-value';
import { recordList } from './public-site-source-list';
import { stringValue } from './public-site-source-string-value';
import type { RecordValue } from './public-site-source-support';

export function parseHomeCollectionShowcase(value: RecordValue): HomeCollectionShowcase {
  const collection = objectValue(value.collection) ?? {};

  return {
    collection: homeGalleryEntry(collection, 'collection'),
    items: recordList<RecordValue>(value.items).map((item) =>
      homeGalleryEntry(item, homeGalleryFeedKind(stringValue(item.kind))),
    ),
  };
}
