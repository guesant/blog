import type { Reference } from '@portfolio/data/domain/types';
import type { FieldsTranslator } from '@/i18n/compat-support';

export function typeSpecificRepositoryFields(
  item: Reference,
  tFields: FieldsTranslator,
): Array<[string, string | number | undefined]> {
  return [
    [tFields('repoName'), [item.repo?.org, item.repo?.name].filter(Boolean).join('/')],
    [tFields('programmingLanguage'), item.repo?.language],
    [tFields('license'), item.repo?.license],
  ];
}
