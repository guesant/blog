import {
  getCaseBySlug,
  getExperimentBySlug,
  getProjectBySlug,
  getReferenceBySlug,
  getReferenceCollectionBySlug,
  getReferences,
  getReferencesByTopic,
  getSnippetBySlug,
  getTechnologyBySlug,
  getTopicBySlug,
  getWritingBySlug,
} from '@portfolio/data/services';
import type { RouteLoader } from './content-data-route-loader';
import { statusData } from './content-data-status-data';

export const detailRouteLoaders: Record<string, RouteLoader> = {
  '/case-detail': async ({ locale, slug }) => {
    const item = slug ? await getCaseBySlug(slug, locale) : undefined;

    return item ? { kind: 'case-detail', item } : statusData(locale, 'notFound');
  },
  '/collection-detail': async ({ locale, slug }) => {
    const collection = slug ? await getReferenceCollectionBySlug(slug, locale) : undefined;

    return collection ? { kind: 'collection-detail', collection } : statusData(locale, 'notFound');
  },
  '/finding-detail': async ({ locale, slug }) => {
    const item = slug ? await getReferenceBySlug(slug, locale) : undefined;

    return item ? { kind: 'finding-detail', item } : statusData(locale, 'notFound');
  },
  '/finding-type': async ({ locale, type }) => ({
    kind: 'finding-type',
    type: type ?? '',
    references: await getReferences(locale),
  }),
  '/project-detail': async ({ locale, slug }) => {
    const project = slug ? await getProjectBySlug(slug, locale) : undefined;

    return project ? { kind: 'project-detail', project } : statusData(locale, 'notFound');
  },
  '/experiment-detail': async ({ locale, slug }) => {
    const experiment = slug ? await getExperimentBySlug(slug, locale) : undefined;

    return experiment ? { kind: 'experiment-detail', experiment } : statusData(locale, 'notFound');
  },
  '/topic-detail': async ({ locale, slug }) => {
    if (!slug) {
      return statusData(locale, 'notFound');
    }

    const topic = await getTopicBySlug(slug, locale);

    return topic
      ? { kind: 'topic-detail', topic, references: await getReferencesByTopic(slug, locale) }
      : statusData(locale, 'notFound');
  },
  '/snippet-detail': async ({ locale, slug }) => {
    const snippet = slug ? await getSnippetBySlug(slug, locale) : undefined;

    return snippet ? { kind: 'snippet-detail', snippet } : statusData(locale, 'notFound');
  },
  '/technology-detail': async ({ locale, slug }) => {
    const technology = slug ? await getTechnologyBySlug(slug, locale) : undefined;

    return technology ? { kind: 'technology-detail', technology } : statusData(locale, 'notFound');
  },
  '/writing-detail': async ({ locale, slug }) => {
    const item = slug ? await getWritingBySlug(slug, locale) : undefined;

    return item ? { kind: 'writing-detail', item } : statusData(locale, 'notFound');
  },
};
