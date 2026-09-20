import { routing } from '../i18n/routing';

const routePrefixes = routing.locales.map((locale) => ({ locale, prefix: `/${locale}` }));

export function routeContext(pathname: string) {
  const match = routePrefixes.find(
    (item) => pathname === item.prefix || pathname.startsWith(`${item.prefix}/`),
  );

  return match
    ? { locale: match.locale, pathname: pathname.slice(match.prefix.length) || '/' }
    : { locale: routing.defaultLocale, pathname: pathname || '/' };
}
