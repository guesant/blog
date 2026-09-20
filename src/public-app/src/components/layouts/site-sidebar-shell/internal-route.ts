export function internalRoute(route: string, locale: string) {
  const prefix = `/${locale}`;

  const path = route.startsWith(prefix) ? route.slice(prefix.length) : route;

  return path || '/';
}
