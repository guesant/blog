import type { Reference } from '@portfolio/data/domain/types';
import type { FieldsTranslator } from '@/i18n/compat-support';

export function typeSpecificFilmFields(
  item: Reference,
  tFields: FieldsTranslator,
): Array<[string, string | number | undefined]> {
  return [
    [tFields('director'), item.film?.director],
    [tFields('year'), item.film?.year],
    [tFields('duration'), item.film?.duration],
  ];
}
