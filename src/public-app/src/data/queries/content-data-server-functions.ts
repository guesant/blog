import { createServerFn } from '@tanstack/react-start';
import { serializable } from './content-data-serializable';
import { requestSchema } from './content-data-request-schema';

export const loadShell = createServerFn({ method: 'GET' })
  .validator((locale: string) => locale)
  .handler(async ({ data: locale }) => {
    const { loadShellData } = await import('./content-data-server-load-shell');

    return serializable(await loadShellData(locale));
  });

export const loadRoute = createServerFn({ method: 'GET' })
  .validator(requestSchema)
  .handler(async ({ data }) => {
    const { loadRouteDataWithSnapshot } = await import('./content-data-server-load-route');

    return serializable(await loadRouteDataWithSnapshot(data));
  });
