import { createFileRoute } from '@tanstack/react-router';
import type { RouteData } from '../../data/queries';
import {
  fallbackRouteData,
  getSsrQueryData,
  routeQueryOptions,
  SSR_CONTENT_BUDGET_MS,
} from '../../data/queries';
import { metadataForRoute } from './splat-metadata-for-route';
import { requestForPath } from './splat-request-for-path';
import { SplatRoute } from './splat--splat-route';

export const Route = createFileRoute('/_site/$')({
  loader: async ({ context, location }) => {
    const request = requestForPath(location.pathname, location.searchStr);

    return getSsrQueryData({
      queryClient: context.queryClient,
      options: routeQueryOptions(request),
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
  component: SiteSplatRoute,
});

function SiteSplatRoute() {
  return <SplatRoute initialData={Route.useLoaderData()} />;
}
