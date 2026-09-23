import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { serve } from 'srvx/node';
import { productionCompressionMiddleware } from './production-compression-middleware.mjs';
import { productionStaticMiddleware } from './production-static-middleware.mjs';

const { default: server } = await import(
  pathToFileURL(resolve(process.cwd(), 'dist/server/server.js')).href
);

serve({
  fetch: server.fetch,
  middleware: [productionStaticMiddleware, productionCompressionMiddleware],
  port: Number(process.env.PORT ?? 3000),
  hostname: '0.0.0.0',
  gracefulShutdown: true,
});
