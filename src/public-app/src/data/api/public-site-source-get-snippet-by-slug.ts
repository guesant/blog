import type { Snippet } from '../domain/types.ts';
import { slugFromKey } from './public-site-source-slug-from-key';
import { getSnippets } from './public-site-source-get-snippets';

export async function getSnippetBySlug(
  slug: string,
  locale?: string,
): Promise<Snippet | undefined> {
  return (await getSnippets(locale)).find(
    (item) => item.slug === slug || slugFromKey(item.slug) === slug,
  );
}
