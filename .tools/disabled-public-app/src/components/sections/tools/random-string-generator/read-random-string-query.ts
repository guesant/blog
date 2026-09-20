import { characterSets, type CharacterSet } from './types';

export function readRandomStringQuery() {
  const query = new URLSearchParams(window.location.search);

  const queryLength = Number(query.get('length'));

  const queryCount = Number(query.get('count'));

  const nextLength = Number.isFinite(queryLength) ? Math.min(64, Math.max(1, queryLength)) : 12;

  const nextCount = Number.isFinite(queryCount) ? Math.min(50, Math.max(1, queryCount)) : 1;

  const nextEnabled = {
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: false,
  };

  for (const name of Object.keys(characterSets) as CharacterSet[]) {
    const value = query.get(name);

    if (value !== null) {
      nextEnabled[name] = value === 'true';
    }
  }

  return { count: nextCount, enabled: nextEnabled, length: nextLength };
}
