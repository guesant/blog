'use client';

import { Button, type ButtonProps } from '../ui';
import { Link } from '../../i18n/navigation';
import type { routing } from '../../i18n/routing';

type NavigationLocale = (typeof routing.locales)[number];

type NavButtonProps = Omit<ButtonProps<typeof Link>, 'component' | 'href'> & {
  href: string;
  locale?: NavigationLocale;
};

export function NavButton(props: NavButtonProps) {
  const { href, locale, ...rest } = props;

  return <Button component={Link} href={href} locale={locale} {...rest} />;
}
