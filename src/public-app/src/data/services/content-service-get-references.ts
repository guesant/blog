import { getContentCollection } from '../api/public-site-source.ts';
import type { Reference } from '../domain/types.ts';

export async function getReferences(locale?: string): Promise<Reference[]> {
  return getContentCollection<Reference>('references', locale);
}
