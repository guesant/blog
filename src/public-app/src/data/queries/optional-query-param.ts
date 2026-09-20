export function optionalQueryParam(params: URLSearchParams, key: string): string | undefined {
  return params.get(key) || undefined;
}
