import { serve } from 'srvx/node';
import server from '../dist/server/server.js';
import { productionCompressionMiddleware } from './production-compression-middleware.mjs';
import { productionStaticMiddleware } from './production-static-middleware.mjs';

serve({
  fetch: server.fetch,
  middleware: [productionStaticMiddleware, productionCompressionMiddleware],
  port: Number(process.env.PORT ?? 3000),
  hostname: '0.0.0.0',
  gracefulShutdown: true,
});
