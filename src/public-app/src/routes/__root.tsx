/// <reference types="vite/client" />
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useLocation,
} from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';
import '@fontsource-variable/dm-sans';
import '@fontsource-variable/exo-2';
import '@fontsource/ibm-plex-mono';
import '../app/fonts.css';
import '../app/tokens.css';
import { loadThemeMode } from '../data/config/theme';
import { localeFromPathname } from '../i18n/routing';
import { DocumentShell } from '../components/ui';

const themeBootstrapScript = `(() => {
  try {
    const match = document.cookie.match(/(?:^|;\\s*)site-theme=(light|dark)(?:;|$)/);
    if (match) {
      document.documentElement.dataset.theme = match[1];
    }
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
  }),
  component: RootDocument,
});

function RootDocument() {
  const locale = localeFromPathname(useLocation().pathname);

  const themeMode = Route.useLoaderData();

  return (
    <DocumentShell
      locale={locale}
      themeMode={themeMode}
      head={<HeadContent />}
      body={<Outlet />}
      scripts={<Scripts />}
      themeBootstrapScript={themeBootstrapScript}
    />
  );
}
