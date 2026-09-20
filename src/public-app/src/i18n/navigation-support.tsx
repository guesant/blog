import { forwardRef } from 'react';
import { Link as RouterLink, useLocation } from '@tanstack/react-router';
import { routing } from './routing';
import { localizedPath } from './navigation-localized-path';

export type LocaleLinkProps = Omit<React.ComponentProps<typeof RouterLink>, 'to'> & {
  href: string;
  locale?: NavigationLocale;
  scroll?: boolean;
};

export type NavigationLocale = (typeof routing.locales)[number];

export const Link = forwardRef<HTMLAnchorElement, LocaleLinkProps>(function LocaleLink(props, ref) {
  const { href, locale, scroll, ...rest } = props;

  const currentPathname = useLocation({ select: (location) => location.pathname });

  const currentLocale = currentPathname.startsWith('/pt-BR') ? 'pt-BR' : 'en';

  return (
    <RouterLink
      ref={ref}
      to={localizedPath(href, locale ?? currentLocale) as never}
      resetScroll={scroll}
      {...rest}
    />
  );
});
