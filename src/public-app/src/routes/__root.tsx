/// <reference types="vite/client" />
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useLocation,
} from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';
import '@fontsource/ibm-plex-mono';
import '@fontsource-variable/roboto-slab';
import '../app/fonts.css';
import '../app/tokens.css';
import { loadThemeMode } from '../data/config/theme';
import { localeFromPathname } from '../i18n/routing';
import { DocumentShell } from '../components/ui';

const themeBootstrapScript = `(() => {
  try {
    const cookie = document.cookie.match(/(?:^|;\\s*)site-theme=(light|dark)(?:;|$)/);
    const mode = cookie?.[1] ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.dataset.theme = mode;
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
