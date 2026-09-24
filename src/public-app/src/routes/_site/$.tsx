import { createFileRoute } from '@tanstack/react-router';
import { siteRouteHead } from '../site-route-head';
import { siteRouteLoader } from '../site-route-loader';
import { requestForPath } from './splat-request-for-path';
import { SplatRoute } from './splat--splat-route';

export const Route = createFileRoute('/_site/$')({
  loader: async ({ context, location }) => {
    return siteRouteLoader({
      queryClient: context.queryClient,
      request: requestForPath(location.pathname, location.searchStr),
    });
  },
  head: ({ loaderData, match }) => siteRouteHead({ loaderData, pathname: match.pathname }),
  component: SiteSplatRoute,
});

function SiteSplatRoute() {
  return <SplatRoute initialData={Route.useLoaderData()} />;
}
