import {
  getCaseBySlug,
  getExperimentBySlug,
  getProjectBySlug,
  getReferenceCollectionBySlug,
  getSnippetBySlug,
  getTechnologyBySlug,
  getTopicBySlug,
  getWritingBySlug,
} from '@portfolio/data/services';
import { createSlugDetailLoader } from './create-slug-detail-loader';
import type { RouteLoader } from './content-data-route-loader';
import { statusData } from './content-data-status-data';

export const detailRouteLoaders: Record<string, RouteLoader> = {
  '/case-detail': createSlugDetailLoader({
    kind: 'case-detail',
    load: getCaseBySlug,
    build: (item) => ({ kind: 'case-detail', item }),
  }),
  '/collection-detail': createSlugDetailLoader({
    kind: 'collection-detail',
    load: getReferenceCollectionBySlug,
    build: (collection) => ({ kind: 'collection-detail', collection }),
  }),
  '/project-detail': createSlugDetailLoader({
    kind: 'project-detail',
    load: getProjectBySlug,
    build: (project) => ({ kind: 'project-detail', project }),
  }),
  '/experiment-detail': createSlugDetailLoader({
    kind: 'experiment-detail',
    load: getExperimentBySlug,
    build: (experiment) => ({ kind: 'experiment-detail', experiment }),
  }),
  '/topic-detail': async ({ locale, slug }) => {
    if (!slug) {
      return statusData(locale, 'notFound');
    }

    const topic = await getTopicBySlug(slug, locale);

    if (!topic) {
      return statusData(locale, 'notFound');
    }

    return {
      kind: 'topic-detail',
      topic,
      pagination: {
        page: 1,
        perPage: 0,
        total: 0,
        lastPage: 1,
        locale: locale as 'en' | 'pt-BR',
      },
    };
  },
  '/snippet-detail': createSlugDetailLoader({
    kind: 'snippet-detail',
    load: getSnippetBySlug,
    build: (snippet) => ({ kind: 'snippet-detail', snippet }),
  }),
  '/technology-detail': createSlugDetailLoader({
    kind: 'technology-detail',
    load: getTechnologyBySlug,
    build: (technology) => ({ kind: 'technology-detail', technology }),
  }),
  '/writing-detail': createSlugDetailLoader({
    kind: 'writing-detail',
    load: getWritingBySlug,
    build: (item) => ({ kind: 'writing-detail', item }),
  }),
};
