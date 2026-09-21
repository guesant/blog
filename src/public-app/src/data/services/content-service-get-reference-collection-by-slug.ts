import { getContentDocument } from '../api/public-site-source.ts';
import type { ReferenceCollection, ReferenceCollectionDetail } from '../domain/types.ts';
import type { RecordValue } from '../api/public-site-source-support';
import { recordList } from '../api/public-site-source-list';
import { reference } from '../api/public-site-source-reference';
import { stringValue } from '../api/public-site-source-string-value';

export async function getReferenceCollectionBySlug(
  slug: string,
  locale?: string,
): Promise<ReferenceCollectionDetail | undefined> {
  const collection = await getContentDocument<ReferenceCollection & { resources?: RecordValue[] }>(
    'collections',
    slug,
    locale,
  );

  if (!collection) {
    return undefined;
  }

  const { resources, ...rest } = collection;

  const items = recordList<RecordValue>(resources).map((resource) => ({
    reference: reference(resource),
    note: stringValue(resource.note) || undefined,
  }));

  return { ...rest, items };
}
