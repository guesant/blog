import type { CaseStudy, Project } from '../domain/types.ts';
import { getContentCollection } from './public-site-source-get-content-collection-items';

export async function getFeaturedContent(locale?: string): Promise<{
  cases: CaseStudy[];
  projects: Project[];
}> {
  const [cases, projects] = await Promise.all([
    getContentCollection<CaseStudy>('cases', locale, {
      featured: true,
      perPage: 3,
    }),
    getContentCollection<Project>('projects', locale, {
      featured: true,
      perPage: 3,
    }),
  ]);

  return {
    cases,
    projects,
  };
}
