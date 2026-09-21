import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useLocation } from '@tanstack/react-router';
import type { RouteData } from '../../data/queries';
import { routeQueryOptions } from '../../data/queries';
import { RouteView } from '../../route-view';
import { routeContext } from '../_site';
import { metadataForRoute } from './splat-metadata-for-route';

export const Route = createFileRoute('/_site/')({
  loader: ({ context, location }) => {
    const { locale } = routeContext(location.pathname);

    return context.queryClient.ensureQueryData(
      routeQueryOptions({ locale, pathname: '/', search: location.searchStr }),
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
  component: HomeRoute,
});

function HomeRoute() {
  const location = useLocation();

  const { locale } = routeContext(location.pathname);

  const data = useSuspenseQuery(
    routeQueryOptions({ locale, pathname: '/', search: location.searchStr }),
  ).data;

  return <RouteView data={data} />;
}
