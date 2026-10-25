import type { HomeGalleryTotals } from '../domain/pages-content';
import { numberOrZero } from './public-site-source-number-or-zero';
import { objectValue } from './public-site-source-object-value';

export function parseHomeGalleryTotals(value: unknown): HomeGalleryTotals {
  const payload = objectValue(value) ?? {};

  return {
    feed: numberOrZero(payload.feed),
    collectionShowcases: numberOrZero(payload.collection_showcases),
  };
}
