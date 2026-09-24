export function buildFeedNavigationHref(
  action: string,
  query: URLSearchParams,
  changes: (params: URLSearchParams) => void,
) {
  const params = new URLSearchParams(Object.fromEntries(query));

  changes(params);

  return `${action}${params.size ? `?${params.toString()}` : ''}`;
}
