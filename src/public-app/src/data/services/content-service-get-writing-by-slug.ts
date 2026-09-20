import { getContentDocument, normalizeLocale } from '../api/public-site-source.ts';
import type { Writing } from '../domain/types.ts';

export async function getWritingBySlug(
  slug: string,
  locale?: string,
): Promise<Writing | undefined> {
  const writing = await getContentDocument<Writing>('writing', slug, locale);

  return writing ? { ...writing, language: normalizeLocale(locale) } : undefined;
}
