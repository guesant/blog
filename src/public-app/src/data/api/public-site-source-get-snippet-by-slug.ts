import type { Snippet } from '../domain/types.ts';
import { getContentDocument } from './public-site-source-get-content-document';

export async function getSnippetBySlug(
  slug: string,
  locale?: string,
): Promise<Snippet | undefined> {
  return getContentDocument<Snippet>('snippets', slug, locale);
}
