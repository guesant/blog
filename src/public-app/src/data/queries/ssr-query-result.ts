export type SsrQueryResult<TData> =
  { kind: 'success'; value: TData } | { kind: 'error' } | { kind: 'timeout' };
