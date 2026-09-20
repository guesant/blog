import type { RecordValue } from './public-site-source-support';
import { objectValue } from './public-site-source-object-value';

export function findingListItems(value: unknown): RecordValue[] {
  return Array.isArray(value)
    ? value.filter((item): item is RecordValue => Boolean(objectValue(item)))
    : [];
}
