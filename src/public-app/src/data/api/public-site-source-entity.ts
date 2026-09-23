import { reference } from './public-site-source-reference';
import { recordList } from './public-site-source-list';
import { snippet } from './public-site-source-snippet';
import { stringValue } from './public-site-source-string-value';
import { technologyFields } from './public-site-source-technology-fields';
import type { ContentCollection, RecordValue } from './public-site-source-support';

const entityBuilders: Record<ContentCollection, (item: RecordValue) => RecordValue> = {
  cases: (item) => ({
    ...item,
    number: '',
    ...technologyFields(item),
    metrics: recordList<RecordValue>(item.metrics),
    visual: 'queue',
  }),
  projects: (item) => ({
    ...item,
    currentFocus: item.current_focus,
    ...technologyFields(item),
    metrics: recordList<RecordValue>(item.metrics),
  }),
  experiments: (item) => ({
    ...item,
    ...technologyFields(item),
  }),
  technologies: (item) => ({
    ...item,
    skills: recordList<unknown>(item.skills).map(stringValue),
  }),
  snippets: (item) => snippet(item),
  writing: (item) => ({
    ...item,
    dateISO: item.date,
    readingTime: item.reading_time,
    subject: '',
    tags: recordList<RecordValue>(item.topics).map((topic) =>
      stringValue(topic.name ?? topic.slug),
    ),
    topicSlugs: recordList<RecordValue>(item.topics).map((topic) => stringValue(topic.slug)),
  }),
  references: (item) => Object.fromEntries(Object.entries(reference(item))),
  collections: (item) => ({
    ...item,
    intro: item.intro,
  }),
  credits: (item) => ({ ...item }),
  topics: (item) => ({
    slug: stringValue(item.slug),
    name: stringValue(item.name ?? item.slug),
    kind: item.kind === 'skill' ? 'topic' : item.kind,
    parentSlug: item.parent,
    relations: [],
  }),
};

export function entity(collection: ContentCollection, item: RecordValue): RecordValue {
  return entityBuilders[collection](item);
}
