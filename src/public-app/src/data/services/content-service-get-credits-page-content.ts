import { getLocalizedCredits } from '../api/public-site-source.ts';
import type { ContentCollectionQuery } from '../api/public-site-source-support';
import type { CreditsPageContent } from '../domain/types.ts';
import { getCreditsPageCopy } from './content-service-get-credits-page-copy';
import { creditToPackage } from './content-service-credit-to-package';

export async function getCreditsPageContent(
  locale?: string,
  query: ContentCollectionQuery = {},
): Promise<CreditsPageContent> {
  const [page, credits] = await Promise.all([
    getCreditsPageCopy(locale),
    getLocalizedCredits(locale, query),
  ]);

  return {
    page,
    credits,
    libraries: credits.groups.libraries.map(creditToPackage),
    tools: credits.groups.tools.map(creditToPackage),
  };
}
