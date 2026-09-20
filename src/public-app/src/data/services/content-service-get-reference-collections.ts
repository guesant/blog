import { getContentCollection } from '../api/public-site-source.ts';
import type { ReferenceCollection } from '../domain/types.ts';

export async function getReferenceCollections(locale?: string): Promise<ReferenceCollection[]> {
  return getContentCollection<ReferenceCollection>('collections', locale);
}
