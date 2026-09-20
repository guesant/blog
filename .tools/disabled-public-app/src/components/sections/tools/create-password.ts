import { randomIndex } from './random-index';
import { characterSets, type CharacterSet, type PasswordResult } from './password-generator-types';

export function createPassword(
  length: number,
  enabled: Record<CharacterSet, boolean>,
): PasswordResult {
  const alphabet = Object.entries(characterSets)
    .filter(([name]) => enabled[name as CharacterSet])
    .map(([, characters]) => characters)
    .join('');

  if (!alphabet) {
    return { value: '', bits: 0 };
  }

  const value = Array.from({ length }, () => alphabet[randomIndex(alphabet.length)]).join('');

  return { value, bits: Math.round(length * Math.log2(alphabet.length)) };
}
