import type { CaseStudy, Project } from '../domain/types.ts';
import type { ContentCollectionMeta } from './public-site-source-support';
import { getContentCollectionPage } from './public-site-source-get-content-collection';

export async function getFeaturedContent(locale?: string): Promise<{
  cases: CaseStudy[];
  casesPagination: ContentCollectionMeta;
  projects: Project[];
  projectsPagination: ContentCollectionMeta;
}> {
  const [cases, projects] = await Promise.all([
    getContentCollectionPage<CaseStudy>('cases', locale, {
      featured: true,
      perPage: 3,
    }),
    getContentCollectionPage<Project>('projects', locale, {
      featured: true,
      perPage: 3,
    }),
  ]);

  return {
    cases: cases.items,
    casesPagination: cases.meta,
    projects: projects.items,
    projectsPagination: projects.meta,
  };
}
