export function readContentFeedQueryValue(
  query: URLSearchParams,
  key: string,
  fallback: string,
): string {
  return query.get(key) || fallback;
}
