import { createServerFn } from '@tanstack/react-start';
import { serializable } from './content-data-serializable';
import { requestSchema } from './content-data-request-schema';
import { getServerStaleWhileRevalidate } from './content-data-server-cache';
import type { RouteData } from './content-data-support';

export const loadShell = createServerFn({ method: 'GET' })
  .validator((locale: string) => locale)
  .handler(async ({ data: locale }) => {
    const { loadShellData } = await import('./content-data-server-load-shell');

    const shell = await getServerStaleWhileRevalidate({
      key: `shell:${locale}`,
      loader: () => loadShellData(locale),
      fallback: undefined,
    });

    if (shell === undefined) {
      throw new Error('Public site shell is unavailable');
    }

    return serializable(shell);
  });

export const loadRoute = createServerFn({ method: 'GET' })
  .validator(requestSchema)
  .handler(async ({ data }) => {
    const { loadShellData } = await import('./content-data-server-load-shell');

    const { loadRouteDataForRequest } = await import('./content-data-server-load-route');

    const shell = await getServerStaleWhileRevalidate({
      key: `shell:${data.locale}`,
      loader: () => loadShellData(data.locale),
      fallback: undefined,
    });

    const route = await getServerStaleWhileRevalidate<RouteData | undefined>({
      key: `route:${JSON.stringify(data)}`,
      loader: async () => loadRouteDataForRequest(data, { shell }),
      fallback: undefined,
    });

    if (route === undefined) {
      throw new Error('Public site route is unavailable');
    }

    return serializable(route);
  });
