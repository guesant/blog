import { normalizeLocale, fetchFindingList } from '../api/public-site-source.ts';
import type { Reference } from '../domain/types.ts';

export async function getReferencesByTopic(slug: string, locale?: string): Promise<Reference[]> {
  return (await fetchFindingList({ topic: slug, page: 1, perPage: 100 }, normalizeLocale(locale)))
    .items;
}
