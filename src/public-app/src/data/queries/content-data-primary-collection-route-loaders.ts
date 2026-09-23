import {
  getCasesPageCopy,
  getCollectionPage,
  getProjectsPageCopy,
  getWritingPageCopy,
} from '@portfolio/data/services';
import type {
  CaseStudy,
  Experiment,
  Project,
  Snippet,
  Technology,
  Topic,
  Writing,
} from '@portfolio/data/domain/types';
import { collectionQuery } from './content-data-collection-query';
import { collectionsRouteLoader } from './content-data-primary-collections-route';
import type { RouteLoader } from './content-data-route-loader';

export const collectionRouteLoaders: Record<string, RouteLoader> = {
  '/cases': async ({ locale, search }) => {
    const result = await getCollectionPage<CaseStudy>('cases', locale, collectionQuery(search));

    return {
      kind: 'cases',
      page: await getCasesPageCopy(locale),
      items: result.items,
      pagination: result.meta,
    };
  },
  '/collections': collectionsRouteLoader,
  '/colecoes': collectionsRouteLoader,
  '/projects': async ({ locale, search }) => {
    const [projects, experiments] = await Promise.all([
      getCollectionPage<Project>('projects', locale, collectionQuery(search, 'projects_page')),
      getCollectionPage<Experiment>(
        'experiments',
        locale,
        collectionQuery(search, 'experiments_page'),
      ),
    ]);

    return {
      kind: 'projects',
      page: await getProjectsPageCopy(locale),
      projects: projects.items,
      projectsPagination: projects.meta,
      experiments: experiments.items,
      experimentsPagination: experiments.meta,
    };
  },
  '/writing': async ({ locale, search }) => {
    const result = await getCollectionPage<Writing>('writing', locale, collectionQuery(search));

    return {
      kind: 'writing',
      page: await getWritingPageCopy(locale),
      writings: result.items,
      findings: [],
      collections: [],
      pagination: result.meta,
    };
  },
  '/snippets': async ({ locale, search }) => {
    const result = await getCollectionPage<Snippet>('snippets', locale, collectionQuery(search));

    return { kind: 'snippets', snippets: result.items, pagination: result.meta };
  },
  '/technologies': async ({ locale, search }) => {
    const result = await getCollectionPage<Technology>(
      'technologies',
      locale,
      collectionQuery(search),
    );

    return { kind: 'technologies', technologies: result.items, pagination: result.meta };
  },
  '/topics': async ({ locale, search }) => {
    const result = await getCollectionPage<Topic>('topics', locale, collectionQuery(search));

    return { kind: 'topics', topics: result.items, pagination: result.meta };
  },
};
