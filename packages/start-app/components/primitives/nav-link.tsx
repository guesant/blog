'use client';

import MuiLink, { type LinkProps } from '@mui/material/Link';
import { Link } from '../../i18n/navigation';
import type { routing } from '../../i18n/routing';

type NavigationLocale = (typeof routing.locales)[number];

type NavLinkProps = Omit<LinkProps, 'component' | 'href'> & {
  href: string;
  locale?: NavigationLocale;
};

export function NavLink(props: NavLinkProps) {
  const { href, locale, ...rest } = props;
  return <MuiLink component={Link} href={href} locale={locale} {...rest} />;
}
