import { getLocalizedPage } from '../api/public-site-source.ts';
import type { CreditsPageCopy } from '../domain/types.ts';

export async function getCreditsPageCopy(locale?: string): Promise<CreditsPageCopy> {
  return getLocalizedPage<CreditsPageCopy>('credits', locale);
}
