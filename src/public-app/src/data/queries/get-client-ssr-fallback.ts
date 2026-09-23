import type { QueryKey } from '@tanstack/react-query';
import { prefetchClientQuery } from './prefetch-client-query';
import type { DefaultSsrQueryDataOptions } from './get-ssr-query-data-options';

export function getClientSsrFallback<TQueryFnData, TData, TQueryKey extends QueryKey>(
  props: DefaultSsrQueryDataOptions<TQueryFnData, TData, TQueryKey>,
): TData {
  prefetchClientQuery({
    request: () => props.queryClient.prefetchQuery(props.options),
  });

  return props.fallback;
}
