import { getSnippets as getSnippetsFromSource } from '../api/public-site-source.ts';
import type { Snippet } from '../domain/types.ts';

export async function getSnippets(locale?: string): Promise<Snippet[]> {
  return getSnippetsFromSource(locale);
}
