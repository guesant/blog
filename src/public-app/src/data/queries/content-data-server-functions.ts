import { createServerFn } from '@tanstack/react-start';
import { fallbackRouteData } from './content-data-fallback-route';
import { fallbackShellData } from './content-data-fallback-shell';
import { serializable } from './content-data-serializable';
import { requestSchema } from './content-data-request-schema';
import { getServerStaleWhileRevalidate } from './content-data-server-cache';

export const loadShell = createServerFn({ method: 'GET' })
  .validator((locale: string) => locale)
  .handler(async ({ data: locale }) => {
    const { loadShellData } = await import('./content-data-server-load-shell');

    return serializable(
      await getServerStaleWhileRevalidate({
        key: `shell:${locale}`,
        loader: () => loadShellData(locale),
        fallback: fallbackShellData,
      }),
    );
  });

export const loadRoute = createServerFn({ method: 'GET' })
  .validator(requestSchema)
  .handler(async ({ data }) => {
    const { loadShellData } = await import('./content-data-server-load-shell');

    const { loadRouteDataForRequest } = await import('./content-data-server-load-route');

    const shell = await getServerStaleWhileRevalidate({
      key: `shell:${data.locale}`,
      loader: () => loadShellData(data.locale),
      fallback: fallbackShellData,
    });

    return serializable(
      await getServerStaleWhileRevalidate({
        key: `route:${JSON.stringify(data)}`,
        loader: async () => loadRouteDataForRequest(data, { shell }),
        fallback: fallbackRouteData,
      }),
    );
  });
