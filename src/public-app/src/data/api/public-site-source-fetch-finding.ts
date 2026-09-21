import type { Reference } from '../domain/types.ts';
import { ContentLocale } from './public-site-source-support';
import { apiClient } from './public-site-source-api-client';
import { objectValue } from './public-site-source-object-value';
import { reference } from './public-site-source-reference';
import { getFinding } from './public-site-generated-client';

export async function fetchFinding(
  slug: string,
  locale: ContentLocale,
): Promise<Reference | undefined> {
  const result = await getFinding({
    client: apiClient(),
    path: { slug },
    query: { locale },
  });

  if (!result.data) {
    return undefined;
  }

  const value = objectValue(result.data);

  return value ? reference(value) : undefined;
}
