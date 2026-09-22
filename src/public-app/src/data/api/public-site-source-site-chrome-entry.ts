import type { ContentLocale, RecordValue } from './public-site-source-support';

export type SiteChromeEntry = {
  value?: RecordValue;
  expiresAt: number;
  promise?: Promise<RecordValue>;
};

export type SiteChromeEntries = Map<ContentLocale, SiteChromeEntry>;
