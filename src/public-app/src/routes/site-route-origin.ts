export function siteRouteOrigin(): string {
  return globalThis.process?.env.SITE_URL ?? 'https://blog.guesant.net';
}
