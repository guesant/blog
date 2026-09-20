import { getSnippetBySlug as getSnippetBySlugFromSource } from '../api/public-site-source.ts';
import type { Snippet } from '../domain/types.ts';

export async function getSnippetBySlug(
  slug: string,
  locale?: string,
): Promise<Snippet | undefined> {
  return getSnippetBySlugFromSource(slug, locale);
}
