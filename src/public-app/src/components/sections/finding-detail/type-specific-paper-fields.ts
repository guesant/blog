import type { Reference } from '@portfolio/data/domain/types';
import type { FieldsTranslator } from '@/i18n/compat-support';

export function typeSpecificPaperFields(
  item: Reference,
  tFields: FieldsTranslator,
): Array<[string, string | number | undefined]> {
  return [
    [tFields('journal'), item.paper?.journal],
    [tFields('conference'), item.paper?.conference],
    [tFields('year'), item.paper?.year],
    [tFields('doi'), item.paper?.doi],
  ];
}
