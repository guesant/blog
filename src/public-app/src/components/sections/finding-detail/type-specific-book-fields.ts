import type { Reference } from '@portfolio/data/domain/types';
import type { FieldsTranslator } from '@/i18n/compat-support';
import { bookFieldDefinitions } from './type-specific-field-definitions';
import { typeSpecificFields } from './type-specific-fields';

export function typeSpecificBookFields(
  item: Reference,
  tFields: FieldsTranslator,
): Array<[string, string | number | undefined]> {
  return typeSpecificFields(item, tFields, bookFieldDefinitions);
}
