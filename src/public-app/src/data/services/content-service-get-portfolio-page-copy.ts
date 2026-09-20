import { getLocalizedPage } from '../api/public-site-source.ts';

export async function getPortfolioPageCopy(locale?: string) {
  return getLocalizedPage<import('../domain/types.ts').PortfolioPageCopy>('portfolio', locale);
}
