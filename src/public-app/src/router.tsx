import { QueryClient } from '@tanstack/react-query';
import { createRouter } from '@tanstack/react-router';
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query';
import {
  contentQueryGcTimeMs,
  contentQueryStaleTimeMs,
} from './data/queries/content-query-cache-policy';
import { contentQueryRetryCount } from './data/queries/content-query-retry-policy';
import { routeTree } from './routeTree.gen';

export function getRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        queryKeyHashFn: (queryKey) =>
          JSON.stringify(queryKey, (key, value) => (key === 'baseUrl' ? undefined : value)),
        staleTime: contentQueryStaleTimeMs,
        gcTime: contentQueryGcTimeMs,
        retry: contentQueryRetryCount,
      },
    },
  });

  const router = createRouter({
    routeTree,
    context: { queryClient },
    defaultPreload: 'viewport',
    defaultPreloadStaleTime: contentQueryStaleTimeMs,
  });

  setupRouterSsrQueryIntegration({ router, queryClient });
  return router;
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
