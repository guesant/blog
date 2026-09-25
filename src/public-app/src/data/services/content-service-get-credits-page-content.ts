import { getLocalizedCredits } from '../api/public-site-source.ts';
import type { ContentCollectionQuery } from '../api/public-site-source-support';
import type { CreditsPageContent } from '../domain/types.ts';
import { getCreditsPageCopy } from './content-service-get-credits-page-copy';

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
  };
}
