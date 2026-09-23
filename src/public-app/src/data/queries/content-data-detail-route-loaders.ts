import {
  getCaseBySlug,
  getCollectionPage,
  getExperimentBySlug,
  getProjectBySlug,
  getReferenceBySlug,
  getReferenceCollectionBySlug,
  getSnippetBySlug,
  getTechnologyBySlug,
  getTopicBySlug,
  getWritingBySlug,
} from '@portfolio/data/services';
import type { Reference } from '@portfolio/data/domain/types';
import { collectionQuery } from './content-data-collection-query';
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
  '/finding-detail': createSlugDetailLoader({
    kind: 'finding-detail',
    load: getReferenceBySlug,
    build: (item) => ({ kind: 'finding-detail', item }),
  }),
  '/finding-type': async ({ locale, type, search }) => {
    const result = await getCollectionPage<Reference>('references', locale, {
      ...collectionQuery(search),
      type,
    });

    return {
      kind: 'finding-type',
      type: type ?? '',
      references: result.items,
      pagination: result.meta,
    };
  },
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
  '/topic-detail': async ({ locale, slug, search }) => {
    if (!slug) {
      return statusData(locale, 'notFound');
    }

    const topic = await getTopicBySlug(slug, locale);

    if (!topic) {
      return statusData(locale, 'notFound');
    }

    const result = await getCollectionPage<Reference>('references', locale, {
      ...collectionQuery(search),
      topic: slug,
    });

    return {
      kind: 'topic-detail',
      topic,
      references: result.items,
      pagination: result.meta,
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
