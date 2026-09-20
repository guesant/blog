import { getLocalizedPage } from '../api/public-site-source.ts';
import type { AboutPageCopy } from '../domain/types.ts';

export async function getAboutPageCopy(locale?: string): Promise<AboutPageCopy> {
  return getLocalizedPage<AboutPageCopy>('about', locale);
}
