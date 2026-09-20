import { resolve } from 'node:path';
import { serveStatic } from 'srvx/static';

const staticMiddleware = serveStatic({ dir: resolve(process.cwd(), 'dist/client') });

export async function productionStaticMiddleware(request, next) {
  const response = await staticMiddleware(request, next);

  if (response.status !== 200 || !new URL(request.url).pathname.startsWith('/assets/')) {
    return response;
  }

  const headers = new Headers(response.headers);
  headers.set('cache-control', 'public, max-age=31536000, immutable');

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
