import type { HomeGallery, HomeGalleryEntryKind } from '../domain/pages-content';
import { homeGalleryEntry } from './public-site-source-home-gallery-entry';
import { parseHomeCollectionShowcase } from './public-site-source-parse-home-collection-showcase';
import { parseHomeGalleryPortfolio } from './public-site-source-parse-home-gallery-portfolio';
import { parseHomeGalleryTotals } from './public-site-source-parse-home-gallery-totals';
import { feedItem } from './public-site-source-feed-item';
import { objectValue } from './public-site-source-object-value';
import { recordList } from './public-site-source-list';
import { stringValue } from './public-site-source-string-value';
import type { RecordValue } from './public-site-source-support';

export function parseHomeGallery(value: unknown): HomeGallery {
  const payload = objectValue(value) ?? {};

  const collectionShowcases = recordList<RecordValue>(payload.collection_showcases).map(
    parseHomeCollectionShowcase,
  );

  return {
    highlights: recordList<RecordValue>(payload.highlights).map((entry) => {
      const item = objectValue(entry.item) ?? {};

      const kind = stringValue(entry.kind) as HomeGalleryEntryKind;

      return homeGalleryEntry(item, kind);
    }),
    feed: recordList<RecordValue>(payload.feed).map(feedItem),
    portfolio: parseHomeGalleryPortfolio(payload.portfolio),
    collectionShowcases,
    totals: parseHomeGalleryTotals(payload.totals),
  };
}
