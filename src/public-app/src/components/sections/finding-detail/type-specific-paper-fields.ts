import type { Reference } from '@portfolio/data/domain/types';

export function typeSpecificPaperFields(
  item: Reference,
  tFields: (key: string) => string,
): Array<[string, string | number | undefined]> {
  return [
    [tFields('journal'), item.paper?.journal],
    [tFields('conference'), item.paper?.conference],
    [tFields('year'), item.paper?.year],
    [tFields('doi'), item.paper?.doi],
  ];
}
