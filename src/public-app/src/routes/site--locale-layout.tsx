import { Outlet, useLoaderData, useLocation } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { getMessages, I18nProvider } from '../i18n/compat';
import { MaintenancePage } from '../components/layouts/maintenance-page';
import { SiteShell } from '../components/layouts/site-shell';
import { ThemeRegistry } from '../components/ui/theme-registry';
import { fallbackShellData, shellQueryOptions } from '../data/queries';
import { routeContext } from './site-route-context';

export function LocaleLayout() {
  const { locale } = routeContext(useLocation().pathname);

  const themeMode = useLoaderData({ from: '__root__' });

  const loaderShell = useLoaderData({ from: '/_site' });

  const shell = useQuery(shellQueryOptions(locale)).data ?? loaderShell ?? fallbackShellData;

  const content = shell.site.maintenanceEnabled ? (
    <MaintenancePage site={shell.site} profile={shell.profile} />
  ) : (
    <SiteShell
      profile={shell.profile}
      site={shell.site}
      availability={shell.availability}
      children={<Outlet />}
    />
  );

  return (
    <I18nProvider locale={locale} messages={getMessages(locale)}>
      <ThemeRegistry initialMode={themeMode}>{content}</ThemeRegistry>
    </I18nProvider>
  );
}
