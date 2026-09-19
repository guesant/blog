import { Outlet, createFileRoute, useLocation } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { I18nProvider } from '../../i18n/compat';
import { routing } from '../../i18n/routing';
import { MaintenancePage } from '../../components/layouts/maintenance-page';
import { SiteShell } from '../../components/layouts/site-shell';
import { ThemeRegistry } from '../../app/theme-registry';
import { shellQueryOptions } from '../data/content';

export function routeContext(pathname: string) {
  const localePrefix = `/${routing.locales.find((locale) => locale !== routing.defaultLocale)}`;
  if (pathname === localePrefix || pathname.startsWith(`${localePrefix}/`)) {
    return {
      locale: routing.locales.find((locale) => locale !== routing.defaultLocale)!,
      pathname: pathname.slice(localePrefix.length) || '/',
    };
  }
  return { locale: routing.defaultLocale, pathname: pathname || '/' };
}

export const Route = createFileRoute('/_site')({
  loader: ({ context, location }) => {
    const { locale } = routeContext(location.pathname);
    return context.queryClient.ensureQueryData(shellQueryOptions(locale));
  },
  component: LocaleLayout,
});

function LocaleLayout() {
  const { locale } = routeContext(useLocation().pathname);
  const shell = useSuspenseQuery(shellQueryOptions(locale)).data;
  const content = shell.site.maintenanceEnabled ? (
    <MaintenancePage site={shell.site} profile={shell.profile} />
  ) : (
    <SiteShell profile={shell.profile} site={shell.site} availability={shell.availability}>
      <Outlet />
    </SiteShell>
  );

  return (
    <I18nProvider locale={locale} messages={shell.messages}>
      <ThemeRegistry>{content}</ThemeRegistry>
    </I18nProvider>
  );
}
