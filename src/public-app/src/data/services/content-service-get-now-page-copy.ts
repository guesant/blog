import { getLocalizedPage } from '../api/public-site-source.ts';

export async function getNowPageCopy(locale?: string) {
  return getLocalizedPage<import('../domain/types.ts').NowPageCopy>('now', locale);
}
