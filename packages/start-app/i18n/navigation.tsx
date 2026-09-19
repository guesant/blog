import { forwardRef } from 'react';
import { Link as RouterLink, useLocation } from '@tanstack/react-router';
import { routing } from './routing';

type LocaleLinkProps = Omit<React.ComponentProps<typeof RouterLink>, 'to'> & {
  href: string;
  locale?: NavigationLocale;
  scroll?: boolean;
};

type NavigationLocale = (typeof routing.locales)[number];

export function localizedPath(href: string, locale: NavigationLocale) {
  const normalized = href || '/';
  const withoutLocale = normalized.replace(/^\/(?:en|pt-BR)(?=\/|$)/, '') || '/';
  return locale === routing.defaultLocale ? withoutLocale : `/${locale}${withoutLocale}`;
}

export const Link = forwardRef<HTMLAnchorElement, LocaleLinkProps>(function LocaleLink(
  props,
  ref,
) {
  const { href, locale = routing.defaultLocale, scroll: _scroll, ...rest } = props;
  return <RouterLink ref={ref} to={localizedPath(href, locale) as never} {...rest} />;
});

export function usePathname() {
  return useLocation({ select: (location) => location.pathname });
}
