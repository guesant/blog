import type { RecordValue } from './public-site-source-support';

export function referenceRelations(value: unknown): RecordValue[] {
  const relations = Array.isArray(value) ? value : [];

  return relations.filter((item): item is RecordValue => Boolean(item && typeof item === 'object'));
}
