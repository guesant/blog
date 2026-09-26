import type { Reference } from '@portfolio/data/domain/types';
import type { FieldsTranslator } from '@/i18n/compat-support';

export function typeSpecificBookFields(
  item: Reference,
  tFields: FieldsTranslator,
): Array<[string, string | number | undefined]> {
  return [
    [tFields('publisher'), item.book?.publisher],
    [tFields('edition'), item.book?.edition],
    [tFields('pages'), item.book?.pages],
    [tFields('isbn'), item.book?.isbn],
  ];
}
