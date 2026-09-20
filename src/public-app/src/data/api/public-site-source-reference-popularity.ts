import type { Reference } from '../domain/types.ts';
import { objectValue } from './public-site-source-object-value';

export function referencePopularity(value: unknown): Reference['popularity'] {
  const popularity = objectValue(value);

  if (!popularity) {
    return undefined;
  }

  return {
    value: Number(popularity.value ?? 0),
    kind: String(popularity.kind ?? ''),
    rank: Number(popularity.rank ?? 0),
  };
}
