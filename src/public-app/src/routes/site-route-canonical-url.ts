export function siteRouteCanonicalUrl(siteOrigin: string, fallbackPath: string): string {
  return new URL(fallbackPath, siteOrigin).toString();
}
