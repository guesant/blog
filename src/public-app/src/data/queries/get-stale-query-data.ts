import type { DefaultError, FetchQueryOptions, QueryClient, QueryKey } from '@tanstack/react-query';

type GetStaleQueryDataOptions<TQueryFnData, TError, TData, TQueryKey extends QueryKey> = {
  queryClient: QueryClient;
  options: FetchQueryOptions<TQueryFnData, TError, TData, TQueryKey>;
  fallback: TData;
};

export function getStaleQueryData<
  TQueryFnData,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(props: GetStaleQueryDataOptions<TQueryFnData, TError, TData, TQueryKey>): TData {
  const cachedData = props.queryClient.getQueryData<TData>(props.options.queryKey);

  void props.queryClient.prefetchQuery(props.options);

  return cachedData ?? props.fallback;
}
