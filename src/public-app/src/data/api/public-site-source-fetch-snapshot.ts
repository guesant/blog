import { getPublicSite } from './generated/index.ts';
import {
  ContentLocale,
  Snapshot,
  snapshotRequests,
  snapshotRequestTtlMs,
} from './public-site-source-support';
import { apiClient } from './public-site-source-api-client';

export async function fetchSnapshot(locale: ContentLocale): Promise<Snapshot> {
  const now = Date.now();

  const current = snapshotRequests.get(locale);

  if (current && current.expiresAt > now) {
    return current.promise;
  }

  const promise = getPublicSite({ client: apiClient(), query: { locale } }).then((result) => {
    if (!result.data) {
      throw new Error('Public site API returned an empty snapshot');
    }

    return result.data as Snapshot;
  });

  const request = { expiresAt: now + snapshotRequestTtlMs, promise };

  snapshotRequests.set(locale, request);
  promise.catch(() => {
    if (snapshotRequests.get(locale) === request) {
      snapshotRequests.delete(locale);
    }
  });
  return promise;
}
