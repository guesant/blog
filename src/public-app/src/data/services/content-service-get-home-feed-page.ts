import type {
  ContentCollectionMeta,
  ContentCollectionQuery,
} from '../api/public-site-source-support';
import type { Reference, ReferenceCollection, Writing } from '../domain/types';
import { getCollectionPage } from './content-service-get-collection-page';

export type HomeFeedPage = {
  writings: Writing[];
  findings: Reference[];
  collections: ReferenceCollection[];
  meta: ContentCollectionMeta;
};

export async function getHomeFeedPage(
  locale?: string,
  query?: ContentCollectionQuery,
): Promise<HomeFeedPage> {
  const [writings, findings, collections] = await Promise.all([
    getCollectionPage<Writing>('writing', locale, query),
    getCollectionPage<Reference>('references', locale, query),
    getCollectionPage<ReferenceCollection>('collections', locale, query),
  ]);

  return {
    writings: writings.items,
    findings: findings.items,
    collections: collections.items,
    meta: {
      page: writings.meta.page,
      perPage: writings.meta.perPage + findings.meta.perPage + collections.meta.perPage,
      total: writings.meta.total + findings.meta.total + collections.meta.total,
      lastPage: Math.max(writings.meta.lastPage, findings.meta.lastPage, collections.meta.lastPage),
      locale: writings.meta.locale,
    },
  };
}
