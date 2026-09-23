import type { QueryKey } from '@tanstack/react-query';
import { createSsrQueryRequest } from './create-ssr-query-request';
import { createSsrQueryTimeout } from './create-ssr-query-timeout';
import type { DefaultSsrQueryDataOptions } from './get-ssr-query-data-options';
import { resolveSsrQueryResult } from './resolve-ssr-query-result';

export async function getServerSsrQueryWithTimeout<TQueryFnData, TData, TQueryKey extends QueryKey>(
  props: DefaultSsrQueryDataOptions<TQueryFnData, TData, TQueryKey>,
): Promise<TData> {
  const result = await Promise.race([
    createSsrQueryRequest(props),
    createSsrQueryTimeout<TData>(props.timeoutMs),
  ]);

  return resolveSsrQueryResult({
    result,
    fallback: props.fallback,
    errorFallback: props.errorFallback,
  });
}
