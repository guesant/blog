import { createCsrfMiddleware, createMiddleware, createStart } from '@tanstack/react-start';
import { metadataProxyHandler } from './app/start-metadata-proxy';

const metadataProxy = createMiddleware({ type: 'request' }).server(metadataProxyHandler);

export const startInstance = createStart(() => ({
  requestMiddleware: [
    metadataProxy,
    createCsrfMiddleware({
      filter: (context) => context.handlerType === 'serverFn',
    }),
  ],
}));
