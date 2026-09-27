import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { productionCompressionMiddleware } from './production-compression-middleware.mjs';
import { productionSecurityMiddleware } from './production-security-middleware.mjs';
import { productionStaticMiddleware } from './production-static-middleware.mjs';

const nodeRequire = createRequire(resolve(process.cwd(), 'package.json'));
const { serve } = nodeRequire('srvx/node');

const { default: server } = await import(
  pathToFileURL(resolve(process.cwd(), 'dist/server/server.js')).href
);

serve({
  fetch: server.fetch,
  middleware: [
    productionStaticMiddleware,
    productionSecurityMiddleware,
    productionCompressionMiddleware,
  ],
  port: Number(process.env.PORT ?? 3000),
  hostname: '0.0.0.0',
  gracefulShutdown: true,
});
