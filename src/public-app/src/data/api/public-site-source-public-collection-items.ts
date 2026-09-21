import type { ContentCollection, RecordValue } from './public-site-source-support';
import { entity } from './public-site-source-entity';
import { recordList } from './public-site-source-list';

export function publicCollectionItems<T>(
  collection: Exclude<ContentCollection, 'references'>,
  value: unknown,
): T[] {
  return recordList<RecordValue>(value).map((item) => entity(collection, item) as T);
}
