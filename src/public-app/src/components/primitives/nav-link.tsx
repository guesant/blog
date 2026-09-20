'use client';

import { Link as UiLink, type LinkProps } from '../ui';
import { Link } from '../../i18n/navigation';
import type { routing } from '../../i18n/routing';

type NavigationLocale = (typeof routing.locales)[number];

type NavLinkProps = Omit<LinkProps, 'component' | 'href'> & {
  href: string;
  locale?: NavigationLocale;
  visualVariant?: string;
};

export function NavLink(props: NavLinkProps) {
  const { href, locale, ...rest } = props;

  return <UiLink component={Link} href={href} locale={locale} {...rest} />;
}
