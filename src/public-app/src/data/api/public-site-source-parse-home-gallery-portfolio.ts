import type { HomeGalleryEntryKind, HomeGalleryPortfolio } from '../domain/pages-content';
import { homeGalleryEntry } from './public-site-source-home-gallery-entry';
import { objectValue } from './public-site-source-object-value';
import { recordList } from './public-site-source-list';
import type { RecordValue } from './public-site-source-support';

const portfolioFields = [
  ['cases', 'cases'],
  ['projects', 'projects'],
  ['experiments', 'experiments'],
  ['collections', 'collection'],
  ['snippets', 'snippets'],
  ['technologies', 'technologies'],
  ['topics', 'topics'],
  ['credits', 'credits'],
] as const satisfies ReadonlyArray<readonly [keyof HomeGalleryPortfolio, HomeGalleryEntryKind]>;

export function parseHomeGalleryPortfolio(value: unknown): HomeGalleryPortfolio {
  const payload = objectValue(value) ?? {};

  return Object.fromEntries(
    portfolioFields.map(([field, kind]) => [
      field,
      recordList<RecordValue>(payload[field]).map((item) => homeGalleryEntry(item, kind)),
    ]),
  ) as HomeGalleryPortfolio;
}
