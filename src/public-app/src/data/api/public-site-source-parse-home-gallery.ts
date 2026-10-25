import type { HomeGallery } from '../domain/pages-content';
import { parseHomeCollectionShowcase } from './public-site-source-parse-home-collection-showcase';
import { parseHomeGalleryTotals } from './public-site-source-parse-home-gallery-totals';
import { feedItem } from './public-site-source-feed-item';
import { objectValue } from './public-site-source-object-value';
import { recordList } from './public-site-source-list';
import type { RecordValue } from './public-site-source-support';

export function parseHomeGallery(value: unknown): HomeGallery {
  const payload = objectValue(value) ?? {};

  const collectionShowcases = recordList<RecordValue>(payload.collection_showcases).map(
    parseHomeCollectionShowcase,
  );

  return {
    feed: recordList<RecordValue>(payload.feed).map(feedItem),
    collectionShowcases,
    totals: parseHomeGalleryTotals(payload.totals),
  };
}
