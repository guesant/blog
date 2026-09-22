import type { SiteChromeEntries, SiteChromeEntry } from './public-site-source-site-chrome-entry';
import type { ContentLocale, RecordValue } from './public-site-source-support';

type SiteChromeSettlementOptions = {
  locale: ContentLocale;
  entries: SiteChromeEntries;
  entry: SiteChromeEntry;
  current?: SiteChromeEntry;
  promise: Promise<RecordValue>;
};

export function settleSiteChromeRequest(props: SiteChromeSettlementOptions): void {
  void props.promise.then(
    (value) => {
      if (props.entries.get(props.locale) !== props.entry) {
        return;
      }

      props.entry.value = value;
      props.entry.expiresAt = Date.now() + 30_000;
      props.entry.promise = undefined;
    },
    () => {
      if (props.entries.get(props.locale) !== props.entry) {
        return;
      }

      if (props.current) {
        props.entry.promise = undefined;
        props.entry.expiresAt = 0;
        return;
      }

      props.entries.delete(props.locale);
    },
  );
}
