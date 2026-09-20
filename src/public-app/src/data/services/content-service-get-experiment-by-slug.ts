import { getContentDocument } from '../api/public-site-source.ts';
import type { Experiment } from '../domain/types.ts';

export async function getExperimentBySlug(
  slug: string,
  locale?: string,
): Promise<Experiment | undefined> {
  return getContentDocument<Experiment>('experiments', slug, locale);
}
