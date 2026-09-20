import { randomIndex } from '../random-index';
import { characterSets, type CharacterSet } from './types';

export function createStrings(
  length: number,
  count: number,
  enabled: Record<CharacterSet, boolean>,
) {
  const alphabet = Object.entries(characterSets)
    .filter(([name]) => enabled[name as CharacterSet])
    .map(([, characters]) => characters)
    .join('');

  if (!alphabet) {
    return [];
  }

  return Array.from({ length: count }, () =>
    Array.from({ length }, () => alphabet[randomIndex(alphabet.length)]).join(''),
  );
}
