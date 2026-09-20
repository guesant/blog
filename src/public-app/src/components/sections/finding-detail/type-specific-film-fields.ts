import type { Reference } from '@portfolio/data/domain/types';

export function typeSpecificFilmFields(
  item: Reference,
  tFields: (key: string) => string,
): Array<[string, string | number | undefined]> {
  return [
    [tFields('director'), item.film?.director],
    [tFields('year'), item.film?.year],
    [tFields('duration'), item.film?.duration],
  ];
}
