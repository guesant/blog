import type { RecordValue } from './public-site-source-support';
import type { SiteChromeEntry } from './public-site-source-site-chrome-entry';

export function readFreshChrome(
  entry: SiteChromeEntry | undefined,
  now: number,
): RecordValue | undefined {
  if (entry?.value && entry.expiresAt > now) {
    return entry.value;
  }

  return undefined;
}
