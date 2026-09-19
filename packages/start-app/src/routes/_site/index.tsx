import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useLocation } from '@tanstack/react-router';
import { routeQueryOptions } from '../../data/content';
import { RouteView } from '../../route-view';
import { routeContext } from '../_site';

export const Route = createFileRoute('/_site/')({
  loader: ({ context, location }) => {
    const { locale } = routeContext(location.pathname);
    return context.queryClient.ensureQueryData(routeQueryOptions({ locale, pathname: '/' }));
  },
  component: HomeRoute,
});

function HomeRoute() {
  const { locale } = routeContext(useLocation().pathname);
  const data = useSuspenseQuery(routeQueryOptions({ locale, pathname: '/' })).data;
  return <RouteView data={data} />;
}
