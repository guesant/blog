import { getContentCollection, normalizeLocale } from '../api/public-site-source.ts';
import type { Writing } from '../domain/types.ts';

export async function getLatestNotes(locale?: string): Promise<Writing[]> {
  const language = normalizeLocale(locale);

  return (await getContentCollection<Writing>('writing', locale)).map((writing) => ({
    ...writing,
    language,
  }));
}
