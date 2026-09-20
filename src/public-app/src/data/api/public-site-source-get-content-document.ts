import { RecordValue, ContentCollection } from './public-site-source-support';
import { slugFromKey } from './public-site-source-slug-from-key';
import { getContentCollection } from './public-site-source-get-content-collection';

export async function getContentDocument<T>(
  collection: ContentCollection,
  slug: string,
  locale?: string,
): Promise<T | undefined> {
  const item = (await getContentCollection<RecordValue>(collection, locale)).find(
    (value) => value.slug === slug || slugFromKey(value.slug) === slug,
  );

  return item as T | undefined;
}
