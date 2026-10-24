import { getContentDocument } from '../api/public-site-source.ts';
import type { ReferenceCollectionDetail } from '../domain/types.ts';

export async function getReferenceCollectionBySlug(
  slug: string,
  locale?: string,
): Promise<ReferenceCollectionDetail | undefined> {
  const collection = await getContentDocument<ReferenceCollectionDetail>(
    'collections',
    slug,
    locale,
  );

  return collection ? { ...collection, items: [] } : undefined;
}
