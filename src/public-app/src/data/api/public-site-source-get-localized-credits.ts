import type { CreditsContent } from '../domain/types.ts';
import { getContentCollectionPage } from './public-site-source-get-content-collection';
import { creditEntry } from './public-site-source-credit-entry';
import { creditGroup } from './public-site-source-credit-group';
import type { ContentCollectionQuery, RecordValue } from './public-site-source-support';

export async function getLocalizedCredits(
  locale?: string,
  query: ContentCollectionQuery = {},
): Promise<CreditsContent> {
  const page = await getContentCollectionPage<RecordValue>('credits', locale, query);

  const groups = page.groups ?? {};

  return {
    entries: page.items.map(creditEntry),
    meta: page.meta,
    groups: {
      acknowledgements: creditGroup(groups.acknowledgements),
      references: creditGroup(groups.references),
      infrastructure: creditGroup(groups.infrastructure),
      libraries: creditGroup(groups.libraries),
      tools: creditGroup(groups.tools),
    },
  };
}
