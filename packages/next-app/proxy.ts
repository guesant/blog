import { maintenanceEnabled } from '@portfolio/content/maintenance';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const handleI18nRouting = createMiddleware(routing);
const localeHeader = 'X-NEXT-INTL-LOCALE';

function localeFromPathname(pathname: string) {
  return routing.locales.find(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
}

function supportedLocale(value: string | undefined) {
  return routing.locales.find((locale) => locale === value);
}

function resolveMaintenanceLocale(request: NextRequest) {
  const pathnameLocale = localeFromPathname(request.nextUrl.pathname);
  if (pathnameLocale) {
    return pathnameLocale;
  }

  const cookieLocale = supportedLocale(request.cookies.get('NEXT_LOCALE')?.value);
  if (cookieLocale) {
    return cookieLocale;
  }

  return request.headers.get('accept-language')?.toLowerCase().includes('pt')
    ? 'pt-BR'
    : routing.defaultLocale;
}

export function proxy(request: NextRequest) {
  if (maintenanceEnabled && !request.nextUrl.pathname.endsWith('/maintenance')) {
    const locale = resolveMaintenanceLocale(request);
    const url = request.nextUrl.clone();
    const headers = new Headers(request.headers);
    url.pathname = `/${locale}/maintenance`;
    headers.set(localeHeader, locale);
    return NextResponse.rewrite(url, { request: { headers } });
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: ['/((?!api|admin|og|_next|.*\\..*).*)'],
};
