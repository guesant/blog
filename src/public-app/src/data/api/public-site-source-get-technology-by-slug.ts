import type { Technology } from '../domain/types.ts';
import { getContentDocument } from './public-site-source-get-content-document';

export async function getTechnologyBySlug(
  slug: string,
  locale?: string,
): Promise<Technology | undefined> {
  return getContentDocument<Technology>('technologies', slug, locale);
}
