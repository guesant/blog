import type { QueryKey } from '@tanstack/react-query';
import type { DefaultSsrQueryDataOptions } from './get-ssr-query-data-options';
import type { SsrQueryResult } from './ssr-query-result';

export function createSsrQueryRequest<TQueryFnData, TData, TQueryKey extends QueryKey>(
  props: DefaultSsrQueryDataOptions<TQueryFnData, TData, TQueryKey>,
): Promise<SsrQueryResult<TData>> {
  return props.queryClient
    .fetchQuery(props.options)
    .then((value) => ({ kind: 'success' as const, value }))
    .catch(() => ({ kind: 'error' as const }));
}
