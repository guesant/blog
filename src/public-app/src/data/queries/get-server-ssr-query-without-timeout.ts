import type { QueryKey } from '@tanstack/react-query';
import type { DefaultSsrQueryDataOptions } from './get-ssr-query-data-options';

export async function getServerSsrQueryWithoutTimeout<
  TQueryFnData,
  TData,
  TQueryKey extends QueryKey,
>(props: DefaultSsrQueryDataOptions<TQueryFnData, TData, TQueryKey>): Promise<TData> {
  try {
    return await props.queryClient.fetchQuery(props.options);
  } catch {
    return props.fallback;
  }
}
