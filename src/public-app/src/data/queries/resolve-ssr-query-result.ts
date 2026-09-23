import type { SsrQueryResult } from './ssr-query-result';

type ResolveSsrQueryResultProps<TData> = {
  result: SsrQueryResult<TData>;
  fallback: TData;
  errorFallback?: TData;
};

export function resolveSsrQueryResult<TData>(props: ResolveSsrQueryResultProps<TData>): TData {
  if (props.result.kind === 'success') {
    return props.result.value;
  }

  if (props.result.kind === 'error') {
    return props.errorFallback ?? props.fallback;
  }

  return props.fallback;
}
