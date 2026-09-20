import { getContentDocument } from '../api/public-site-source.ts';
import type { CaseStudy } from '../domain/types.ts';

export async function getCaseBySlug(slug: string, locale?: string): Promise<CaseStudy | undefined> {
  return getContentDocument<CaseStudy>('cases', slug, locale);
}
