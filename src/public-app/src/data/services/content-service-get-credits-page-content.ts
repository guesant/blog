import { getLocalizedCredits } from '../api/public-site-source.ts';
import type { CreditsPageContent } from '../domain/types.ts';
import { getCreditsPageCopy } from './content-service-get-credits-page-copy';

export async function getCreditsPageContent(locale?: string): Promise<CreditsPageContent> {
  const [page, credits] = await Promise.all([
    getCreditsPageCopy(locale),
    getLocalizedCredits(locale),
  ]);

  const packageCredit = (entry: CreditsPageContent['credits']['entries'][number]) => ({
    name: entry.name,
    description: entry.description,
  });

  return {
    page,
    credits,
    libraries: credits.entries
      .filter((entry) => entry.category === 'library' || entry.category === 'font')
      .map(packageCredit),
    tools: credits.entries.filter((entry) => entry.category === 'tool').map(packageCredit),
  };
}
