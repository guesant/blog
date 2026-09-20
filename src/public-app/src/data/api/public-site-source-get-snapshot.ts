import { Snapshot, snapshotContext } from './public-site-source-support';
import { normalizeLocale } from './public-site-source-normalize-locale';
import { fetchSnapshot } from './public-site-source-fetch-snapshot';

export async function getSnapshot(locale?: string): Promise<Snapshot> {
  const normalized = normalizeLocale(locale);

  const current = snapshotContext.getStore();

  if (current?.locale === normalized) {
    return current.snapshot;
  }
  return fetchSnapshot(normalized);
}
