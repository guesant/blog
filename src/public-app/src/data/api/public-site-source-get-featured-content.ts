import type { CaseStudy, Project, Writing } from '../domain/types.ts';
import { getSnapshot } from './public-site-source-get-snapshot';
import { entity } from './public-site-source-entity';
import { recordList } from './public-site-source-list';
import type { RecordValue } from './public-site-source-support';

export async function getFeaturedContent(locale?: string): Promise<{
  cases: CaseStudy[];
  projects: Project[];
  writings: Writing[];
}> {
  const snapshot = await getSnapshot(locale);

  return {
    cases: recordList<RecordValue>(snapshot.featured_cases).map(
      (item) => entity('cases', item) as CaseStudy,
    ),
    projects: recordList<RecordValue>(snapshot.featured_projects).map(
      (item) => entity('projects', item) as Project,
    ),
    writings: recordList<RecordValue>(snapshot.featured_writings).map(
      (item) => entity('writing', item) as Writing,
    ),
  };
}
