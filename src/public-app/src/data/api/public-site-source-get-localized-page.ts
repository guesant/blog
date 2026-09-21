import { RecordValue } from './public-site-source-support';
import { getSnapshot } from './public-site-source-get-snapshot';

export async function getLocalizedPage<T>(slug: string, locale?: string): Promise<T> {
  const snapshot = await getSnapshot(locale);

  const page = { ...(snapshot.pages[slug] ?? {}) } as RecordValue;

  if (slug === 'home') {
    return { featuredCases: [], featuredProjects: [], featuredWriting: [], ...page } as T;
  }

  return page as T;
}
