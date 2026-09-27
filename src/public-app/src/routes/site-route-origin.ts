export function siteRouteOrigin(): string {
  return globalThis.process?.env.SITE_URL ?? 'https://guesant.net';
}
