import type { RecordValue } from './public-site-source-support';
import { objectValue } from './public-site-source-object-value';

export function recordOrEmpty(value: unknown): RecordValue {
  return objectValue(value) ?? {};
}
