import { fetchFinding, normalizeLocale } from '../api/public-site-source.ts';
import type { Reference } from '../domain/types.ts';

export async function getReferenceBySlug(
  slug: string,
  locale?: string,
): Promise<Reference | undefined> {
  const normalizedLocale = normalizeLocale(locale);

  return fetchFinding(slug, normalizedLocale);
}
