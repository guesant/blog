import type { SsrQueryResult } from './ssr-query-result';

export function createSsrQueryTimeout<TData>(timeoutMs?: number): Promise<SsrQueryResult<TData>> {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ kind: 'timeout' }), timeoutMs);
  });
}
