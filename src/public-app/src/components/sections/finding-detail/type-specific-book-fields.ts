import type { Reference } from '@portfolio/data/domain/types';

export function typeSpecificBookFields(
  item: Reference,
  tFields: (key: string) => string,
): Array<[string, string | number | undefined]> {
  return [
    [tFields('publisher'), item.book?.publisher],
    [tFields('edition'), item.book?.edition],
    [tFields('pages'), item.book?.pages],
    [tFields('isbn'), item.book?.isbn],
  ];
}
