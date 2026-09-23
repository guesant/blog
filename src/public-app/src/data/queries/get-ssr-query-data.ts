import type { QueryKey } from '@tanstack/react-query';
import { getCachedSsrQueryData } from './get-cached-ssr-query-data';
import { getClientSsrFallback } from './get-client-ssr-fallback';
import { getServerSsrQueryData } from './get-server-ssr-query-data';
import type { DefaultSsrQueryDataOptions } from './get-ssr-query-data-options';

export async function getSsrQueryData<
  TQueryFnData,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(props: DefaultSsrQueryDataOptions<TQueryFnData, TData, TQueryKey>): Promise<TData> {
  const cachedData = getCachedSsrQueryData(props);

  if (cachedData !== undefined) {
    return cachedData;
  }

  if (typeof window !== 'undefined') {
    return getClientSsrFallback(props);
  }

  return getServerSsrQueryData(props);
}
