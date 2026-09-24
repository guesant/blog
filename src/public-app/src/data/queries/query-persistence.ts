import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { hydrate } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import { parsePersistedQueryState } from './parse-persisted-query-state';

export const queryPersistenceBuster = 'public-app-query-cache-v1';

const queryPersistenceKey = 'guesant:public-app:query-cache:v1';

export const queryPersistenceMaxAgeMs = 24 * 60 * 60 * 1000;

let queryPersistenceStorage: Storage | undefined;

if (typeof window !== 'undefined') {
  try {
    queryPersistenceStorage = window.localStorage;
  } catch {
    queryPersistenceStorage = undefined;
  }
}

export const queryPersister = createAsyncStoragePersister({
  storage: queryPersistenceStorage,
  key: queryPersistenceKey,
  throttleTime: 1000,
});

export function restorePersistedQueryClient(queryClient: QueryClient): void {
  try {
    hydrate(
      queryClient,
      parsePersistedQueryState(
        queryPersistenceStorage?.getItem(queryPersistenceKey) ?? '',
        queryPersistenceBuster,
        queryPersistenceMaxAgeMs,
      ),
    );
  } catch {
    queryPersistenceStorage?.removeItem(queryPersistenceKey);
  }
}
