import type { Reference } from '@portfolio/data/domain/types';
import type { FieldsTranslator } from '@/i18n/compat-support';

export function typeSpecificVideoFields(
  item: Reference,
  tFields: FieldsTranslator,
): Array<[string, string | number | undefined]> {
  return [
    [tFields('channel'), item.video?.channel],
    [tFields('duration'), item.video?.duration],
  ];
}
