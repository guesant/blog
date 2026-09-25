import type { HomeGallerySectionTotals } from '../domain/pages-content';
import { numberOrZero } from './public-site-source-number-or-zero';
import { objectValue } from './public-site-source-object-value';

export function parseHomeGalleryTotalsGroup(value: unknown): HomeGallerySectionTotals {
  const payload = objectValue(value) ?? {};


  return {
    writing: numberOrZero(payload.writing),
    finding: numberOrZero(payload.finding),
    collection: numberOrZero(payload.collection),
  };
}
