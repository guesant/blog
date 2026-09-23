import type { CreditEntry } from '../domain/types.ts';
import type { RecordValue } from './public-site-source-support';
import { creditEntry } from './public-site-source-credit-entry';
import { recordList } from './public-site-source-list';

export function creditGroup(value: unknown): CreditEntry[] {
  return recordList<RecordValue>(value).map(creditEntry);
}
