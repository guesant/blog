import { getSitePage } from './public-site-generated-client';
import { apiClient } from './public-site-source-api-client';
import { RecordValue } from './public-site-source-support';

export async function getLocalizedPage<T>(slug: string, locale?: string): Promise<T> {
  const result = await getSitePage({
    client: apiClient(),
    path: { slug },
    query: { locale },
  });

  const page = { ...((result.data ?? {}) as RecordValue) };

  if (slug === 'home') {
    return { featuredCases: [], featuredProjects: [], featuredWriting: [], ...page } as T;
  }

  return page as T;
}
