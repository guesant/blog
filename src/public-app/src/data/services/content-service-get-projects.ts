import { getContentCollection } from '../api/public-site-source.ts';
import type { Project } from '../domain/types.ts';

export async function getProjects(locale?: string): Promise<Project[]> {
  return getContentCollection<Project>('projects', locale);
}
