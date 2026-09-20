import type { Reference } from '../domain/types.ts';

export function referenceIdentifiers(value: unknown): Reference['identifiers'] {
  return Array.isArray(value) ? (value as Reference['identifiers']) : [];
}
