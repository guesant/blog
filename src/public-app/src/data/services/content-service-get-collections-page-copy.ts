import { getLocalizedPage } from '../api/public-site-source.ts';
import type { PageIntroduction } from '../domain/types.ts';

export async function getCollectionsPageCopy(locale?: string): Promise<PageIntroduction> {
  return getLocalizedPage<PageIntroduction>('collections', locale);
}
