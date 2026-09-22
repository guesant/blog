import { normalizeLocale } from './public-site-source-normalize-locale';
import { readFreshChrome } from './public-site-source-read-fresh-chrome';
import { requestSiteChrome } from './public-site-source-request-chrome';
import type { SiteChromeEntries } from './public-site-source-site-chrome-entry';

const chromeEntries: SiteChromeEntries = new Map();

export async function getLocalizedSiteChrome(locale?: string) {
  const normalizedLocale = normalizeLocale(locale);

  const current = chromeEntries.get(normalizedLocale);

  const fresh = readFreshChrome(current, Date.now());

  if (fresh) {
    return fresh;
  }

  if (current?.promise) {
    return current.value ?? current.promise;
  }

  return requestSiteChrome(normalizedLocale, chromeEntries, current);
}
