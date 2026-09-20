import { RecordValue } from './public-site-source-support';
import { getSnapshot } from './public-site-source-get-snapshot';
import { featuredPage } from './public-site-source-featured-page';

export async function getLocalizedPage<T>(slug: string, locale?: string): Promise<T> {
  const snapshot = await getSnapshot(locale);

  const page = { ...(snapshot.pages[slug] ?? {}) } as RecordValue;

  if (slug === 'home') {
    return featuredPage({
      page: featuredPage({
        page: featuredPage({
          page,
          key: 'featuredCases',
          value: snapshot.featured_cases,
        }),
        key: 'featuredProjects',
        value: snapshot.featured_projects,
      }),
      key: 'featuredWriting',
      value: snapshot.featured_writings,
    }) as T;
  }

  return page as T;
}
