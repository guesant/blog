import { getCollectionPage, getFeedPage, getWritingPageCopy } from '@portfolio/data/services';
import type { Snippet, Technology, Topic } from '@portfolio/data/domain/types';
import { collectionQuery } from './content-data-collection-query';
import { collectionsRouteLoader } from './content-data-primary-collections-route';
import type { RouteLoader } from './content-data-route-loader';

export const collectionRouteLoaders: Record<string, RouteLoader> = {
  '/collections': collectionsRouteLoader,
  '/colecoes': collectionsRouteLoader,
  '/writing': async ({ locale, search }) => {
    const result = await getFeedPage(locale, { ...collectionQuery(search), kind: 'post' });

    return {
      kind: 'writing',
      page: await getWritingPageCopy(locale),
      feedItems: result.items,
      feedPagination: result.meta,
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
