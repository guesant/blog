import type { DetailEntry } from './types';

export function pushEntry(
  entries: DetailEntry[],
  label: string,
  value: string | number | undefined,
) {
  if (value === undefined || value === '') {
    return;
  }
  entries.push({ label, value: String(value) });
}
