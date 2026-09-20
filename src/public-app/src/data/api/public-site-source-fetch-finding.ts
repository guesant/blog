import type { Reference } from '../domain/types.ts';
import { getFinding } from './generated/index.ts';
import { RecordValue, ContentLocale } from './public-site-source-support';
import { apiClient } from './public-site-source-api-client';
import { reference } from './public-site-source-reference';

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

  return reference(result.data as RecordValue);
}
