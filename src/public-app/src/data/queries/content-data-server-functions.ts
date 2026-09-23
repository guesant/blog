import { createServerFn } from '@tanstack/react-start';
import { errorRouteData } from './content-data-fallback-route';
import { serializable } from './content-data-serializable';
import { requestSchema } from './content-data-request-schema';
import { getServerStaleWhileRevalidate } from './content-data-server-cache';

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

    return serializable(
      await getServerStaleWhileRevalidate({
        key: `route:${JSON.stringify(data)}`,
        loader: async () => loadRouteDataForRequest(data, { shell }),
        fallback: errorRouteData,
      }),
    );
  });
