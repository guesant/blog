import { getContentCollection } from '../api/public-site-source.ts';
import type { Experiment } from '../domain/types.ts';

export async function getExperiments(locale?: string): Promise<Experiment[]> {
  return getContentCollection<Experiment>('experiments', locale);
}
