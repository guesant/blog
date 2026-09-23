import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useLocation } from '@tanstack/react-router';
import type { RouteData } from '../../data/queries';
import {
  errorRouteData,
  fallbackRouteData,
  getSsrQueryData,
  routeQueryOptions,
  SSR_CONTENT_BUDGET_MS,
} from '../../data/queries';
import { RouteView } from '../../route-view';
import { routeContext } from '../_site';
import { metadataForRoute } from './splat-metadata-for-route';

export const Route = createFileRoute('/_site/')({
  loader: async ({ context, location }) => {
    const { locale } = routeContext(location.pathname);

    return getSsrQueryData({
      queryClient: context.queryClient,
      options: routeQueryOptions({ locale, pathname: '/', search: location.searchStr }),
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
  component: HomeRoute,
});

function HomeRoute() {
  const location = useLocation();

  const { locale } = routeContext(location.pathname);

  const loaderData = Route.useLoaderData();

  const routeQuery = useQuery(
    routeQueryOptions({ locale, pathname: '/', search: location.searchStr }),
  );

  const data =
    routeQuery.data ?? loaderData ?? (routeQuery.isError ? errorRouteData : fallbackRouteData);

  return <RouteView data={data} />;
}
