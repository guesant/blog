import { getPublicContent } from './public-site-generated-client';
import { RecordValue, ContentCollection } from './public-site-source-support';
import { normalizeLocale } from './public-site-source-normalize-locale';
import { apiClient } from './public-site-source-api-client';
import { entity } from './public-site-source-entity';

export async function getContentDocument<T>(
  collection: ContentCollection,
  slug: string,
  locale?: string,
): Promise<T | undefined> {
  const language = normalizeLocale(locale);

  const result = await getPublicContent({
    client: apiClient(),
    path: { collection, slug },
    query: { locale: language },
  });

  if (!result.data) {
    if (result.response?.status === 404) {
      return undefined;
    }

    throw new Error('Public site API returned an empty content response');
  }

  return entity(collection, result.data as RecordValue) as T;
}
