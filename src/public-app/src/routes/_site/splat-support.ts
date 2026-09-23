import { createFileRoute } from '@tanstack/react-router';
import { createElement } from 'react';
import {
  fallbackRouteData,
  getSsrQueryData,
  routeQueryOptions,
  SSR_CONTENT_BUDGET_MS,
} from '../../data/queries';
import type { RouteData } from '../../data/queries';
import { requestForPath } from './splat-request-for-path';
import { metadataForRoute } from './splat-metadata-for-route';
import { SplatRoute } from './splat--splat-route';

export type RouteMetadata = { title: string; description: string; type?: string };

export const Route = createFileRoute('/_site/splat-support')({
  loader: async ({ context, location }) => {
    return getSsrQueryData({
      queryClient: context.queryClient,
      options: routeQueryOptions(requestForPath(location.pathname, location.searchStr)),
      fallback: fallbackRouteData,
      timeoutMs: SSR_CONTENT_BUDGET_MS,
    });
  },
  head: ({ loaderData }) => {
    const metadata = metadataForRoute(loaderData as RouteData | undefined);

    return {
      meta: [
        { title: `${metadata.title} · guesant.net` },
        { name: 'description', content: metadata.description },
        { property: 'og:title', content: metadata.title },
        { property: 'og:description', content: metadata.description },
        { property: 'og:type', content: metadata.type ?? 'website' },
      ],
    };
  },
  component: SiteSplatSupportRoute,
});

function SiteSplatSupportRoute() {
  return createElement(SplatRoute, { initialData: Route.useLoaderData() });
}
