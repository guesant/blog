import { useLoaderData, useLocation } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { getMessages, I18nProvider } from '../i18n/compat';
import { LocaleLayoutState } from './-locale-layout-state';
import { ThemeRegistry } from '../components/ui/theme-registry';
import { shellQueryOptions } from '../data/queries';
import { routeContext } from './site-route-context';

export function LocaleLayout() {
  const { locale } = routeContext(useLocation().pathname);

  const themeState = useLoaderData({ from: '__root__' });

  const loaderShell = useLoaderData({ from: '/_site' });

  const shellQuery = useQuery(shellQueryOptions(locale));

  const shell = shellQuery.data ?? loaderShell;

  return (
    <I18nProvider locale={locale} messages={getMessages(locale)}>
      <ThemeRegistry
        initialMode={themeState.mode}
        initialResolvedMode={themeState.resolvedMode ?? undefined}
      >
        <LocaleLayoutState
          shell={shell}
          isError={shellQuery.isError}
          retry={() => void shellQuery.refetch()}
        />
      </ThemeRegistry>
    </I18nProvider>
  );
}
