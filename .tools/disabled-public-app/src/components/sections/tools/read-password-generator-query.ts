import { characterSets, type CharacterSet } from './password-generator-types';

export function readPasswordGeneratorQuery() {
  const query = new URLSearchParams(window.location.search);

  const queryLength = Number(query.get('length'));

  const nextLength = Number.isFinite(queryLength) ? Math.min(64, Math.max(8, queryLength)) : 16;

  const nextEnabled = {
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  };

  for (const name of Object.keys(characterSets) as CharacterSet[]) {
    const value = query.get(name);

    if (value !== null) {
      nextEnabled[name] = value === 'true';
    }
  }

  return { enabled: nextEnabled, length: nextLength };
}
