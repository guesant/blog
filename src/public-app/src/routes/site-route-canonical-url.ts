export function siteRouteCanonicalUrl(
  siteOrigin: string,
  fallbackPath: string,
  override?: string,
): string {
  if (!override?.trim()) {
    return new URL(fallbackPath, siteOrigin).toString();
  }

  try {
    const url = new URL(override, siteOrigin);

    return ['http:', 'https:'].includes(url.protocol)
      ? url.toString()
      : new URL(fallbackPath, siteOrigin).toString();
  } catch {
    return new URL(fallbackPath, siteOrigin).toString();
  }
}
