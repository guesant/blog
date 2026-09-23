import type { DefaultError, FetchQueryOptions, QueryClient, QueryKey } from '@tanstack/react-query';
import { prefetchClientQuery } from './prefetch-client-query';

type GetSsrQueryDataOptions<TQueryFnData, TError, TData, TQueryKey extends QueryKey> = {
  queryClient: QueryClient;
  options: FetchQueryOptions<TQueryFnData, TError, TData, TQueryKey>;
  fallback: TData;
  timeoutMs?: number;
};

export async function getSsrQueryData<
  TQueryFnData,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(props: GetSsrQueryDataOptions<TQueryFnData, TError, TData, TQueryKey>): Promise<TData> {
  const cachedData = props.queryClient.getQueryData<TData>(props.options.queryKey);

  if (cachedData !== undefined) {
    prefetchClientQuery({
      request: () => props.queryClient.prefetchQuery(props.options),
    });

    return cachedData;
  }

  if (typeof window !== 'undefined') {
    prefetchClientQuery({
      request: () => props.queryClient.prefetchQuery(props.options),
    });

    return props.fallback;
  }

  const request = props.queryClient.fetchQuery(props.options).catch(() => undefined);

  if (props.timeoutMs === undefined) {
    return (await request) ?? props.fallback;
  }

  const timeout = new Promise<undefined>((resolve) => {
    setTimeout(resolve, props.timeoutMs);
  });

  const data = await Promise.race([request, timeout]);

  return data ?? props.fallback;
}
