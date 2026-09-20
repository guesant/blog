import type { Reference } from '@portfolio/data/domain/types';

export function typeSpecificRepositoryFields(
  item: Reference,
  tFields: (key: string) => string,
): Array<[string, string | number | undefined]> {
  return [
    [tFields('repoName'), [item.repo?.org, item.repo?.name].filter(Boolean).join('/')],
    [tFields('programmingLanguage'), item.repo?.language],
    [tFields('license'), item.repo?.license],
  ];
}
