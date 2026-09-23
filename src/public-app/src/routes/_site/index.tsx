import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useLocation } from '@tanstack/react-router';
import { routeQueryOptions, useStableRouteData } from '../../data/queries';
import { RouteView } from '../../route-view';
import { routeContext } from '../_site';
import { siteRouteHead } from '../site-route-head';
import { siteRouteLoader } from '../site-route-loader';

export const Route = createFileRoute('/_site/')({
  loader: async ({ context, location }) => {
    const { locale } = routeContext(location.pathname);

    return siteRouteLoader({
      queryClient: context.queryClient,
      request: { locale, pathname: '/', search: location.searchStr },
    });
  },
  head: ({ loaderData }) => siteRouteHead({ loaderData }),
  component: HomeRoute,
});

function HomeRoute() {
  const location = useLocation();

  const { locale } = routeContext(location.pathname);

  const loaderData = Route.useLoaderData();

  const routeQuery = useQuery(
    routeQueryOptions({ locale, pathname: '/', search: location.searchStr }),
  );

  const data = useStableRouteData({
    queryData: routeQuery.data,
    loaderData,
    queryHasError: routeQuery.isError,
  });

  return <RouteView data={data} />;
}
