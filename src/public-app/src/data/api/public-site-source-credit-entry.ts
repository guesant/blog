import type { CreditEntry } from '../domain/types.ts';
import type { RecordValue } from './public-site-source-support';
import { firstText } from './public-site-source-first-text';
import { textValue } from './public-site-source-text-value';

export function creditEntry(credit: RecordValue): CreditEntry {
  return {
    url: textValue(credit.url),
    category: textValue(credit.category),
    name: firstText(credit.package_name, credit.name, credit.category),
    description: textValue(credit.description),
    packageManager: textValue(credit.package_manager) || undefined,
  };
}
