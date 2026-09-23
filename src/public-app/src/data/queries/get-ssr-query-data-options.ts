import type { DefaultError, FetchQueryOptions, QueryClient, QueryKey } from '@tanstack/react-query';

type GetSsrQueryDataOptions<TQueryFnData, TError, TData, TQueryKey extends QueryKey> = {
  queryClient: QueryClient;
  options: FetchQueryOptions<TQueryFnData, TError, TData, TQueryKey>;
  fallback: TData;
  timeoutMs?: number;
};

export type DefaultSsrQueryDataOptions<
  TQueryFnData,
  TData,
  TQueryKey extends QueryKey,
> = GetSsrQueryDataOptions<TQueryFnData, DefaultError, TData, TQueryKey>;
