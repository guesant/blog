import { getContentDocument } from '../api/public-site-source.ts';
import type { Topic } from '../domain/types.ts';

export async function getTopicBySlug(slug: string, locale?: string): Promise<Topic | undefined> {
  return getContentDocument<Topic>('topics', slug, locale);
}
