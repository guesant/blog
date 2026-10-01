import { getSitePage } from './public-site-generated-client';
import { apiClient } from './public-site-source-api-client';
import { objectValue } from './public-site-source-object-value';
import { optionalStringValue } from './public-site-source-optional-string-value';
import type { RecordValue } from './public-site-source-support';

export async function getLocalizedPage<T>(slug: string, locale?: string): Promise<T> {
  const result = await getSitePage({
    client: apiClient(),
    throwOnError: true,
    path: { slug },
    query: { locale },
  });

  const pageValue = objectValue(result.data);

  if (!pageValue) {
    throw new Error('Public site API returned an empty page response');
  }

  const page = {
    ...pageValue,
    ogImageUrl: optionalStringValue(pageValue.og_image_url),
  } as RecordValue;

  if (slug === 'home') {
    return { featuredCases: [], featuredProjects: [], featuredWriting: [], ...page } as T;
  }

  return page as T;
}
