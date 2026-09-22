import { fetchSiteChrome } from './public-site-source-fetch-chrome';
import { settleSiteChromeRequest } from './public-site-source-settle-chrome';
import type { SiteChromeEntries, SiteChromeEntry } from './public-site-source-site-chrome-entry';
import type { ContentLocale, RecordValue } from './public-site-source-support';

export function requestSiteChrome(
  locale: ContentLocale,
  entries: SiteChromeEntries,
  current?: SiteChromeEntry,
): RecordValue | Promise<RecordValue> {
  const promise = fetchSiteChrome(locale);

  const entry = current ?? { expiresAt: 0, promise };

  entry.promise = promise;
  entries.set(locale, entry);
  settleSiteChromeRequest({ locale, entries, entry, current, promise });

  return current?.value ?? promise;
}
