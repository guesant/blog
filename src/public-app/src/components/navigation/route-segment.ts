export function routeSegment(route: string) {
  return route.replace(/\/$/, '').split('/').filter(Boolean).at(-1) ?? '';
}
