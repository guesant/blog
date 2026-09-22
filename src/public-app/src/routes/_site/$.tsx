import { createFileRoute } from '@tanstack/react-router';
import type { RouteData } from '../../data/queries';
import { fallbackRouteData, getStaleQueryData, routeQueryOptions } from '../../data/queries';
import { metadataForRoute } from './splat-metadata-for-route';
import { requestForPath } from './splat-request-for-path';
import { SplatRoute } from './splat--splat-route';

export const Route = createFileRoute('/_site/$')({
  loader: ({ context, location }) => {
    const request = requestForPath(location.pathname, location.searchStr);

    return getStaleQueryData({
      queryClient: context.queryClient,
      options: routeQueryOptions(request),
      fallback: fallbackRouteData,
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
  component: SplatRoute,
});
