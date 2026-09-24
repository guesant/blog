import type { DehydratedState } from '@tanstack/react-query';
import { isPersistedQueryClient } from './is-persisted-query-client';

const emptyDehydratedState: DehydratedState = { mutations: [], queries: [] };

export function parsePersistedQueryState(
  serialized: string,
  buster: string,
  maxAgeMs: number,
): DehydratedState {
  try {
    const persistedClient = JSON.parse(serialized) as unknown;

    if (!isPersistedQueryClient(persistedClient, buster, maxAgeMs)) {
      return emptyDehydratedState;
    }

    return persistedClient.clientState;
  } catch {
    return emptyDehydratedState;
  }
}
