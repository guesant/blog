import { getContentDocument } from '../api/public-site-source.ts';
import type {
  ReferenceCollection,
  ReferenceCollectionDetail,
  ReferenceCollectionItem,
} from '../domain/types.ts';
import { RawCollectionItem } from './content-service-support';
import { getReferences } from './content-service-get-references';
import { collectionItemSlug } from './content-service-collection-item-slug';

export async function getReferenceCollectionBySlug(
  slug: string,
  locale?: string,
): Promise<ReferenceCollectionDetail | undefined> {
  const [collection, references] = await Promise.all([
    getContentDocument<ReferenceCollection & { items?: RawCollectionItem[] }>(
      'collections',
      slug,
      locale,
    ),
    getReferences(locale),
  ]);

  if (!collection) {
    return undefined;
  }

  const bySlug = new Map(references.map((reference) => [reference.slug, reference]));

  const { items: rawItems, ...rest } = collection;

  const items: ReferenceCollectionItem[] = (rawItems ?? []).flatMap((entry) => {
    const itemSlug = collectionItemSlug(entry.item);

    const reference = itemSlug ? bySlug.get(itemSlug) : undefined;

    return reference ? [{ reference, note: entry.note }] : [];
  });

  return { ...rest, items };
}
