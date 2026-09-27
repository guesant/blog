import type { CreditsContent } from '../domain/types.ts';
import { getContentCollectionPage } from './public-site-source-get-content-collection';
import { creditEntry } from './public-site-source-credit-entry';
import type { ContentCollectionQuery, RecordValue } from './public-site-source-support';

export async function getLocalizedCredits(
  locale?: string,
  query: ContentCollectionQuery = {},
): Promise<CreditsContent> {
  const page = await getContentCollectionPage<RecordValue>('credits', locale, query);

  return {
    entries: page.items.map(creditEntry),
    meta: page.meta,
  };
}
