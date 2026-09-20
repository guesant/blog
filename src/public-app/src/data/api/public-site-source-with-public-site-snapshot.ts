import { snapshotContext } from './public-site-source-support';
import { normalizeLocale } from './public-site-source-normalize-locale';
import { fetchSnapshot } from './public-site-source-fetch-snapshot';

export async function withPublicSiteSnapshot<T>(
  locale: string | undefined,
  callback: () => Promise<T>,
): Promise<T> {
  const normalized = normalizeLocale(locale);

  const snapshot = await fetchSnapshot(normalized);

  return snapshotContext.run({ locale: normalized, snapshot }, callback);
}
