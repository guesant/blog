import { createFileRoute } from '@tanstack/react-router';
import { createElement } from 'react';
import { siteRouteHead } from '../site-route-head';
import { siteRouteLoader } from '../site-route-loader';
import { requestForPath } from './splat-request-for-path';
import { SplatRoute } from './splat--splat-route';

export type RouteMetadata = { title: string; description: string; type?: string };

export const Route = createFileRoute('/_site/splat-support')({
  loader: async ({ context, location }) => {
    return siteRouteLoader({
      queryClient: context.queryClient,
      request: requestForPath(location.pathname, location.searchStr),
    });
  },
  head: ({ loaderData }) => siteRouteHead({ loaderData }),
  component: SiteSplatSupportRoute,
});

function SiteSplatSupportRoute() {
  return createElement(SplatRoute, { initialData: Route.useLoaderData() });
}
