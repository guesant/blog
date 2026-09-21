import { getPublicContent } from './public-site-generated-client';
import { RecordValue, ContentCollection } from './public-site-source-support';
import { fetchFinding } from './public-site-source-fetch-finding';
import { normalizeLocale } from './public-site-source-normalize-locale';
import { apiClient } from './public-site-source-api-client';
import { entity } from './public-site-source-entity';

export async function getContentDocument<T>(
  collection: ContentCollection,
  slug: string,
  locale?: string,
): Promise<T | undefined> {
  const language = normalizeLocale(locale);

  if (collection === 'references') {
    return (await fetchFinding(slug, language)) as T | undefined;
  }

  const result = await getPublicContent({
    client: apiClient(),
    path: { collection, slug },
    query: { locale: language },
  });

  if (!result.data) {
    return undefined;
  }

  return entity(collection, result.data as RecordValue) as T;
}
