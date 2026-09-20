import { getContentCollection } from '../api/public-site-source.ts';
import type { CaseStudy } from '../domain/types.ts';

export async function getCases(locale?: string): Promise<CaseStudy[]> {
  return getContentCollection<CaseStudy>('cases', locale);
}
