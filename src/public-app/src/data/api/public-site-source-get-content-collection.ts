import { ContentCollection } from './public-site-source-support';
import { getSnapshot } from './public-site-source-get-snapshot';
import { entity } from './public-site-source-entity';
import { itemsFor } from './public-site-source-items-for';

export async function getContentCollection<T>(
  collection: ContentCollection,
  locale?: string,
): Promise<T[]> {
  const snapshot = await getSnapshot(locale);

  return itemsFor(snapshot, collection).map((item) => entity(collection, item) as T);
}
