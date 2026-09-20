import { getContentDocument } from '../api/public-site-source.ts';
import type { Project } from '../domain/types.ts';

export async function getProjectBySlug(
  slug: string,
  locale?: string,
): Promise<Project | undefined> {
  return getContentDocument<Project>('projects', slug, locale);
}
