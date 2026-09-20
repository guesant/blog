import { getLocalizedPage } from '../api/public-site-source.ts';
import type { PageIntroduction } from '../domain/types.ts';

export async function getAchadosPageCopy(locale?: string): Promise<PageIntroduction> {
  return getLocalizedPage<PageIntroduction>('achados', locale);
}
