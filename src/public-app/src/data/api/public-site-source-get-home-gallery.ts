import { getHomeGallery } from './public-site-generated-client';
import { apiClient } from './public-site-source-api-client';
import { objectValue } from './public-site-source-object-value';
import { parseHomeGallery } from './public-site-source-parse-home-gallery';
import type { HomeGallery } from '../domain/pages-content';

export async function getPublicHomeGallery(locale: 'en' | 'pt-BR'): Promise<HomeGallery> {
  const result = await getHomeGallery({
    client: apiClient(),
    throwOnError: true,
    query: { locale },
  });

  const payload = objectValue(result.data);

  if (!payload) {
    throw new Error('Public site API returned an empty home gallery response');
  }

  return parseHomeGallery(payload);
}
