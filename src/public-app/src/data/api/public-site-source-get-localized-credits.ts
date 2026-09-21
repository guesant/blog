import type { CreditsContent } from '../domain/types.ts';
import { getContentCollectionPage } from './public-site-source-get-content-collection';
import type { ContentCollectionQuery, RecordValue } from './public-site-source-support';
import { textValue } from './public-site-source-text-value';
import { firstText } from './public-site-source-first-text';

export async function getLocalizedCredits(
  locale?: string,
  query: ContentCollectionQuery = {},
): Promise<CreditsContent> {
  const page = await getContentCollectionPage<RecordValue>('credits', locale, query);

  return {
    entries: page.items.map((credit) => ({
      url: textValue(credit.url),
      category: textValue(credit.category),
      name: firstText(credit.package_name, credit.name, credit.category),
      description: textValue(credit.description),
      packageManager: textValue(credit.package_manager) || undefined,
    })),
    meta: page.meta,
  };
}
