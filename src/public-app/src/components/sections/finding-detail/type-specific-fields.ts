import type { FieldsTranslator } from '@/i18n/compat-support';
import type { Reference } from '@portfolio/data/domain/types';

export type TypeSpecificFieldValue = string | number | undefined;

type TypeSpecificFieldReader = (item: Reference) => TypeSpecificFieldValue;

export type TypeSpecificFieldDefinition = readonly [
  Parameters<FieldsTranslator>[0],
  TypeSpecificFieldReader,
];

export function typeSpecificFields(
  item: Reference,
  tFields: FieldsTranslator,
  definitions: readonly TypeSpecificFieldDefinition[],
): Array<[string, TypeSpecificFieldValue]> {
  return definitions.map(([key, read]) => [tFields(key), read(item)]);
}
