import { reference } from './public-site-source-reference';
import { recordList } from './public-site-source-list';
import { snippet } from './public-site-source-snippet';
import { stringValue } from './public-site-source-string-value';
import { technologyFields } from './public-site-source-technology-fields';
import { optionalStringValue } from './public-site-source-optional-string-value';
import { seoMetadata } from './public-site-source-seo';
import type { ContentCollection, RecordValue } from './public-site-source-support';

const entityBuilders: Record<ContentCollection, (item: RecordValue) => RecordValue> = {
  cases: (item) => ({
    ...item,
    seo: seoMetadata(item.seo),
    number: '',
    ...technologyFields(item),
    metrics: recordList<RecordValue>(item.metrics),
    visual: 'queue',
  }),
  projects: (item) => ({
    ...item,
    seo: seoMetadata(item.seo),
    currentFocus: item.current_focus,
    ...technologyFields(item),
    metrics: recordList<RecordValue>(item.metrics),
  }),
  experiments: (item) => ({
    ...item,
    seo: seoMetadata(item.seo),
    ...technologyFields(item),
  }),
  technologies: (item) => ({
    ...item,
    skills: recordList<unknown>(item.skills).map(stringValue),
  }),
  snippets: (item) => ({ ...snippet(item), seo: seoMetadata(item.seo) }),
  writing: (item) => ({
    ...item,
    seo: seoMetadata(item.seo),
    dateISO: item.date,
    readingTime: item.reading_time,
    subject: '',
    tags: recordList<RecordValue>(item.topics).map((topic) =>
      stringValue(topic.name ?? topic.slug),
    ),
    topicSlugs: recordList<RecordValue>(item.topics).map((topic) => stringValue(topic.slug)),
    topicUrls: recordList<RecordValue>(item.topics).map((topic) => stringValue(topic.url)),
  }),
  references: (item) => Object.fromEntries(Object.entries(reference(item))),
  collections: (item) => ({
    ...item,
    seo: seoMetadata(item.seo),
    intro: item.intro,
  }),
  credits: (item) => ({ ...item }),
  topics: (item) => ({
    slug: stringValue(item.slug),
    url: stringValue(item.url) || undefined,
    name: stringValue(item.name ?? item.slug),
    kind: item.kind === 'skill' ? 'topic' : item.kind,
    parentSlug: item.parent,
    relations: [],
  }),
};

export function entity(collection: ContentCollection, item: RecordValue): RecordValue {
  const result = entityBuilders[collection](item);

  return {
    ...result,
    ogImageUrl: optionalStringValue(result.og_image_url ?? result.ogImageUrl),
  };
}
