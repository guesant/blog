export function isSafeRelativeUrl(url: string): boolean {
  return url.startsWith('/') || url.startsWith('#');
}
