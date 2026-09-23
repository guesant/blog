import type { QueryKey } from '@tanstack/react-query';
import type { DefaultSsrQueryDataOptions } from './get-ssr-query-data-options';

export async function getServerSsrQueryData<TQueryFnData, TData, TQueryKey extends QueryKey>(
  props: DefaultSsrQueryDataOptions<TQueryFnData, TData, TQueryKey>,
): Promise<TData> {
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
