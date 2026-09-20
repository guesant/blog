import type { Reference } from '@portfolio/data/domain/types';

export function typeSpecificVideoFields(
  item: Reference,
  tFields: (key: string) => string,
): Array<[string, string | number | undefined]> {
  return [
    [tFields('channel'), item.video?.channel],
    [tFields('duration'), item.video?.duration],
  ];
}
