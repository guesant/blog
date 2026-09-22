import { getSiteChrome } from './public-site-generated-client';
import { apiClient } from './public-site-source-api-client';
import { objectValue } from './public-site-source-object-value';
import type { ContentLocale, RecordValue } from './public-site-source-support';

export function fetchSiteChrome(locale: ContentLocale): Promise<RecordValue> {
  return getSiteChrome({ client: apiClient(), query: { locale } }).then((result) => {
    const value = objectValue(result.data);

    if (!value) {
      throw new Error('Public site API returned an empty chrome response');
    }

    return value;
  });
}
