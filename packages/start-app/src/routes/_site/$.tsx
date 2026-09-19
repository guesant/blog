import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useLocation } from '@tanstack/react-router';
import { routeQueryOptions } from '../../data/content';
import { RouteView } from '../../route-view';
import { routeContext } from '../_site';

function requestForPath(pathname: string) {
  const { locale, pathname: localizedPathname } = routeContext(pathname);
  const splat = localizedPathname.replace(/^\//, '');
  const [first, second, third] = splat.split('/');
  if (first === 'findings' && second === 'types') {
    return { locale, pathname: '/finding-type', type: third };
  }
  if (first === 'projects' && second === 'experiments') {
    return { locale, pathname: '/experiment-detail', slug: third };
  }
  if (second) {
    const detailRoutes: Record<string, string> = {
      cases: '/case-detail',
      colecoes: '/collection-detail',
      collections: '/collection-detail',
      findings: '/finding-detail',
      projects: '/project-detail',
      topics: '/topic-detail',
      writing: '/writing-detail',
    };
    return { locale, pathname: detailRoutes[first] ?? `/${first}`, slug: second };
  }
  return { locale, pathname: `/${first}` };
}

export const Route = createFileRoute('/_site/$')({
  loader: ({ context, location }) => {
    return context.queryClient.ensureQueryData(routeQueryOptions(requestForPath(location.pathname)));
  },
  component: SplatRoute,
});

function SplatRoute() {
  const location = useLocation();
  const request = requestForPath(location.pathname);
  const data = useSuspenseQuery(routeQueryOptions(request)).data;
  return <RouteView data={data} />;
}
