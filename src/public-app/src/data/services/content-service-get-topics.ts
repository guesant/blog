import { getContentCollection } from '../api/public-site-source.ts';
import type { Topic } from '../domain/types.ts';

export async function getTopics(locale?: string): Promise<Topic[]> {
  return getContentCollection<Topic>('topics', locale);
}
