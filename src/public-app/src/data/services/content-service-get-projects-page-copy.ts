import { getLocalizedPage } from '../api/public-site-source.ts';
import type { ProjectsPageCopy } from '../domain/types.ts';

export async function getProjectsPageCopy(locale?: string): Promise<ProjectsPageCopy> {
  return getLocalizedPage<ProjectsPageCopy>('projects', locale);
}
