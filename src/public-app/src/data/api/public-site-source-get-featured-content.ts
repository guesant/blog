import type { CaseStudy, Project, Writing } from '../domain/types.ts';
import { getContentCollection } from './public-site-source-get-content-collection-items';

export async function getFeaturedContent(locale?: string): Promise<{
  cases: CaseStudy[];
  projects: Project[];
  writings: Writing[];
}> {
  return {
    cases: await getContentCollection<CaseStudy>('cases', locale, {
      featured: true,
      perPage: 3,
    }),
    projects: await getContentCollection<Project>('projects', locale, {
      featured: true,
      perPage: 3,
    }),
    writings: await getContentCollection<Writing>('writing', locale, {
      featured: true,
      perPage: 3,
    }),
  };
}
