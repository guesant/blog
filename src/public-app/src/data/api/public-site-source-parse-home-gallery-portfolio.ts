import type { HomeGalleryPortfolio } from '../domain/pages-content';
import { homeGalleryEntry } from './public-site-source-home-gallery-entry';
import { objectValue } from './public-site-source-object-value';
import { recordList } from './public-site-source-list';
import type { RecordValue } from './public-site-source-support';

export function parseHomeGalleryPortfolio(value: unknown): HomeGalleryPortfolio {
  const payload = objectValue(value) ?? {};

  return {
    cases: recordList<RecordValue>(payload.cases).map((item) => homeGalleryEntry(item, 'cases')),
    projects: recordList<RecordValue>(payload.projects).map((item) =>
      homeGalleryEntry(item, 'projects'),
    ),
    experiments: recordList<RecordValue>(payload.experiments).map((item) =>
      homeGalleryEntry(item, 'experiments'),
    ),
    collections: recordList<RecordValue>(payload.collections).map((item) =>
      homeGalleryEntry(item, 'collection'),
    ),
    snippets: recordList<RecordValue>(payload.snippets).map((item) =>
      homeGalleryEntry(item, 'snippets'),
    ),
    technologies: recordList<RecordValue>(payload.technologies).map((item) =>
      homeGalleryEntry(item, 'technologies'),
    ),
    topics: recordList<RecordValue>(payload.topics).map((item) => homeGalleryEntry(item, 'topics')),
    credits: recordList<RecordValue>(payload.credits).map((item) =>
      homeGalleryEntry(item, 'credits'),
    ),
  };
}
