import { ContentLocale } from './public-site-source-support';

export function normalizeLocale(locale?: string): ContentLocale {
  return locale === 'pt-BR' ? 'pt-BR' : 'en';
}
