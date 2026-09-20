import { routing } from './routing';
import type { NavigationLocale } from './navigation-support';

export function localizedPath(href: string, locale: NavigationLocale) {
  const normalized = href || '/';

  const withoutLocale = normalized.replace(/^\/(?:en|pt-BR)(?=\/|$)/, '') || '/';

  return locale === routing.defaultLocale ? withoutLocale : `/${locale}${withoutLocale}`;
}
