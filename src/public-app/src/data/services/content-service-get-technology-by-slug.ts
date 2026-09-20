import { getTechnologyBySlug as getTechnologyBySlugFromSource } from '../api/public-site-source.ts';
import type { Technology } from '../domain/types.ts';

export async function getTechnologyBySlug(
  slug: string,
  locale?: string,
): Promise<Technology | undefined> {
  return getTechnologyBySlugFromSource(slug, locale);
}
