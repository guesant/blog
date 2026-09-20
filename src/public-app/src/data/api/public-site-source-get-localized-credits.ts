import type { CreditsContent } from '../domain/types.ts';
import { getSnapshot } from './public-site-source-get-snapshot';
import { textValue } from './public-site-source-text-value';
import { firstText } from './public-site-source-first-text';

export async function getLocalizedCredits(locale?: string): Promise<CreditsContent> {
  return {
    entries: (await getSnapshot(locale)).credits.map((credit) => ({
      url: textValue(credit.url),
      category: textValue(credit.category),
      name: firstText(credit.package_name, credit.name, credit.category),
      description: textValue(credit.description),
      packageManager: textValue(credit.package_manager) || undefined,
    })),
  };
}
