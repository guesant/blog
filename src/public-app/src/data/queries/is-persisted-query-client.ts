import type { PersistedQueryClient } from './query-persistence-types';

export function isPersistedQueryClient(
  value: unknown,
  buster: string,
  maxAgeMs: number,
): value is PersistedQueryClient {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;

  return [
    typeof record.timestamp === 'number',
    typeof record.buster === 'string',
    Object.hasOwn(record, 'clientState'),
    record.buster === buster,
    Date.now() - Number(record.timestamp) <= maxAgeMs,
  ].every(Boolean);
}
