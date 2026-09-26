import type { Reference } from '@portfolio/data/domain/types';
import type { FieldsTranslator } from '@/i18n/compat-support';
import { paperFieldDefinitions } from './type-specific-field-definitions';
import { typeSpecificFields } from './type-specific-fields';

export function typeSpecificPaperFields(
  item: Reference,
  tFields: FieldsTranslator,
): Array<[string, string | number | undefined]> {
  return typeSpecificFields(item, tFields, paperFieldDefinitions);
}
