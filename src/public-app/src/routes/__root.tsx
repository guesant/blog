/// <reference types="vite/client" />
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useLocation,
} from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import '@fontsource/ibm-plex-mono';
import '@fontsource-variable/roboto-slab';
import '../app/fonts.css';
import '../app/tokens.css';
import { loadThemeMode } from '../data/config/theme';
import {
  queryPersister,
  queryPersistenceBuster,
  queryPersistenceMaxAgeMs,
} from '../data/queries/query-persistence';
import { localeFromPathname } from '../i18n/routing';
import { DocumentShell } from '../components/ui';

const themeBootstrapScript = `(() => {
  try {
    const cookie = document.cookie.match(/(?:^|;\\s*)site-theme=([^;]+)/);
    const value = cookie?.[1] ?? '';
    const cached = value.match(/^system\\.(light|dark)$/)?.[1];
    const resolved = value === 'light' || value === 'dark'
      ? value
      : cached ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.dataset.theme = resolved;
  } catch {}
})();`;

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  loader: () => loadThemeMode(),
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'guesant.net' },
    ],
    links: [{ rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
  }),
  component: RootDocument,
});

function RootDocument() {
  const locale = localeFromPathname(useLocation().pathname);

  const themeState = Route.useLoaderData();

  const routeContext = Route.useRouteContext();

  return (
    <PersistQueryClientProvider
      client={routeContext.queryClient}
      persistOptions={{
        buster: queryPersistenceBuster,
        maxAge: queryPersistenceMaxAgeMs,
        persister: queryPersister,
      }}
    >
      <DocumentShell
        locale={locale}
        themeState={themeState}
        head={<HeadContent />}
        body={<Outlet />}
        scripts={<Scripts />}
        themeBootstrapScript={themeBootstrapScript}
      />
    </PersistQueryClientProvider>
  );
}
