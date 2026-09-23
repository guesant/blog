import type { QueryKey } from '@tanstack/react-query';
import type { DefaultSsrQueryDataOptions } from './get-ssr-query-data-options';
import { getServerSsrQueryWithTimeout } from './get-server-ssr-query-with-timeout';
import { getServerSsrQueryWithoutTimeout } from './get-server-ssr-query-without-timeout';

export async function getServerSsrQueryData<TQueryFnData, TData, TQueryKey extends QueryKey>(
  props: DefaultSsrQueryDataOptions<TQueryFnData, TData, TQueryKey>,
): Promise<TData> {
  if (props.timeoutMs === undefined) {
    return getServerSsrQueryWithoutTimeout(props);
  }

  return getServerSsrQueryWithTimeout(props);
}
