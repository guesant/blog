import { getTechnologies as getTechnologiesFromSource } from '../api/public-site-source.ts';
import type { Technology } from '../domain/types.ts';

export async function getTechnologies(locale?: string): Promise<Technology[]> {
  return getTechnologiesFromSource(locale);
}
