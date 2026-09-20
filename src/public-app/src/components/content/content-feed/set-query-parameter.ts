export function setQueryParameter(params: URLSearchParams, key: string, value: string) {
  if (value) {
    params.set(key, value);
  }
}
