import type { QueryKey } from '@tanstack/react-query';
import { prefetchClientQuery } from './prefetch-client-query';
import type { DefaultSsrQueryDataOptions } from './get-ssr-query-data-options';

export function getCachedSsrQueryData<TQueryFnData, TData, TQueryKey extends QueryKey>(
  props: DefaultSsrQueryDataOptions<TQueryFnData, TData, TQueryKey>,
): TData | undefined {
  const cachedData = props.queryClient.getQueryData<TData>(props.options.queryKey);

  if (cachedData === undefined) {
    return undefined;
  }

  prefetchClientQuery({
    request: () => props.queryClient.prefetchQuery(props.options),
  });

  return cachedData;
}
