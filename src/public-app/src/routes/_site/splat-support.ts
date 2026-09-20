import { createFileRoute } from '@tanstack/react-router';
import { routeQueryOptions } from '../../data/queries';
import type { RouteData } from '../../data/queries';
import { requestForPath } from './splat-request-for-path';
import { metadataForRoute } from './splat-metadata-for-route';
import { SplatRoute } from './splat--splat-route';

export type RouteMetadata = { title: string; description: string; type?: string };

export const Route = createFileRoute('/_site/splat-support')({
  loader: ({ context, location }) => {
    return context.queryClient.ensureQueryData(
      routeQueryOptions(requestForPath(location.pathname, location.searchStr)),
    );
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
