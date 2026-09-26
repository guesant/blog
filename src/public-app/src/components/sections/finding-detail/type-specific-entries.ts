import type { Reference } from '@portfolio/data/domain/types';
import type { FieldsTranslator } from '@/i18n/compat-support';
import type { DetailEntry } from './types';
import { pushEntry } from './push-entry';
import { typeSpecificBookFields } from './type-specific-book-fields';
import { typeSpecificFilmFields } from './type-specific-film-fields';
import { typeSpecificPaperFields } from './type-specific-paper-fields';
import { typeSpecificRepositoryFields } from './type-specific-repository-fields';
import { typeSpecificVideoFields } from './type-specific-video-fields';

export function typeSpecificEntries(item: Reference, tFields: FieldsTranslator): DetailEntry[] {
  const entries: DetailEntry[] = [];

  const fields: Array<[string, string | number | undefined]> = [
    ...typeSpecificBookFields(item, tFields),
    ...typeSpecificPaperFields(item, tFields),
    ...typeSpecificRepositoryFields(item, tFields),
    ...typeSpecificVideoFields(item, tFields),
    ...typeSpecificFilmFields(item, tFields),
  ];

  fields.forEach(([label, value]) => {
    pushEntry(entries, label, value);
  });

  return entries;
}
