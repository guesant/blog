import type { RouteData } from '../../data/queries';
import type { Locale } from '../../i18n/compat-support';
import type { RouteMetadata } from './splat-support';
import { articleMetadata } from './splat-metadata-article';
import { defaultMetadata } from './splat-metadata-default';
import { kindMetadata } from './splat-metadata-kind';
import { metadataFromPage } from './splat-metadata-from-page';
import { contentMetadata } from './splat-metadata-content';
import { localizedMetadata } from './splat-metadata-localized';
import { pageMetadata } from './splat-metadata-page';
import { toMessageKey } from '../../data/config/achados';

type MetadataResolver = (data: RouteData, locale: Locale) => RouteMetadata;

const metadataResolvers: Partial<Record<RouteData['kind'], MetadataResolver>> = {
  home: (data) => (data.kind === 'home' ? metadataFromPage(data.content.page) : defaultMetadata()),
  feed: (_data, locale) =>
    localizedMetadata({
      locale,
      titlePath: 'Pages.feed.title',
      descriptionPath: 'Pages.feed.description',
    }),
  about: pageMetadata,
  cases: pageMetadata,
  collections: pageMetadata,
  contact: pageMetadata,
  findings: pageMetadata,
  follow: pageMetadata,
  license: pageMetadata,
  now: pageMetadata,
  projects: pageMetadata,
  writing: pageMetadata,
  credits: (data) =>
    data.kind === 'credits' ? metadataFromPage(data.content.page) : defaultMetadata(),
  resume: (data) =>
    data.kind === 'resume' ? metadataFromPage(data.content.page) : defaultMetadata(),
  'case-detail': articleMetadata,
  'finding-detail': articleMetadata,
  'writing-detail': articleMetadata,
  'collection-detail': (data) =>
    data.kind === 'collection-detail'
      ? contentMetadata({
          source: data.collection,
          title: data.collection.title,
          description: data.collection.description,
        })
      : defaultMetadata(),
  'project-detail': (data) =>
    data.kind === 'project-detail'
      ? contentMetadata({
          source: data.project,
          title: data.project.name,
          description: data.project.purpose,
          type: 'article',
        })
      : defaultMetadata(),
  'experiment-detail': (data) =>
    data.kind === 'experiment-detail'
      ? contentMetadata({
          source: data.experiment,
          title: data.experiment.name,
          description: data.experiment.purpose,
          type: 'article',
        })
      : defaultMetadata(),
  'snippet-detail': (data) =>
    data.kind === 'snippet-detail'
      ? contentMetadata({
          title: data.snippet.title,
          description: data.snippet.description,
          type: 'article',
        })
      : defaultMetadata(),
  'technology-detail': (data) =>
    data.kind === 'technology-detail'
      ? contentMetadata({
          title: data.technology.name,
          description: data.technology.skills.join(' · '),
        })
      : defaultMetadata(),
  'topic-detail': (data) =>
    data.kind === 'topic-detail'
      ? contentMetadata({ title: data.topic.name, description: data.topic.name })
      : defaultMetadata(),
  snippets: (data, locale) => kindMetadata(data, locale),
  technologies: (data, locale) => kindMetadata(data, locale),
  'finding-type': (data, locale) =>
    data.kind === 'finding-type'
      ? localizedMetadata({
          locale,
          titlePath: `Pages.achados.types.${toMessageKey(data.type)}`,
          descriptionPath: 'Pages.feed.description',
        })
      : defaultMetadata(),
  topics: (_data, locale) =>
    localizedMetadata({
      locale,
      titlePath: 'Pages.topics.indexTitle',
      descriptionPath: 'Pages.topics.indexDescription',
    }),
  portfolio: (data) =>
    data.kind === 'portfolio' ? metadataFromPage(data.page) : defaultMetadata(),
  status: (data, locale) =>
    data.kind === 'status'
      ? localizedMetadata({
          locale,
          titlePath: `Pages.${data.status}.title`,
          descriptionPath: `Pages.${data.status}.description`,
        })
      : defaultMetadata(),
};

export function metadataForRoute(
  data: RouteData | undefined,
  locale: Locale = 'en',
): RouteMetadata {
  if (!data) {
    return defaultMetadata();
  }

  const resolver = metadataResolvers[data.kind];

  if (!resolver) {
    return defaultMetadata();
  }

  return resolver(data, locale);
}
