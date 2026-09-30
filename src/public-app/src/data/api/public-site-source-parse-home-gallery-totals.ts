import type { HomeGalleryTotals } from '../domain/pages-content';
import { numberOrZero } from './public-site-source-number-or-zero';
import { objectValue } from './public-site-source-object-value';

export function parseHomeGalleryTotals(value: unknown): HomeGalleryTotals {
  const payload = objectValue(value) ?? {};

  const portfolio = objectValue(payload.portfolio) ?? {};

  return {
    highlights: numberOrZero(payload.highlights),
    feed: numberOrZero(payload.feed),
    portfolio: {
      cases: numberOrZero(portfolio.cases),
      projects: numberOrZero(portfolio.projects),
      experiments: numberOrZero(portfolio.experiments),
      collections: numberOrZero(portfolio.collections),
      snippets: numberOrZero(portfolio.snippets),
      technologies: numberOrZero(portfolio.technologies),
      topics: numberOrZero(portfolio.topics),
      credits: numberOrZero(portfolio.credits),
    },
    collectionShowcases: numberOrZero(payload.collection_showcases),
  };
}
