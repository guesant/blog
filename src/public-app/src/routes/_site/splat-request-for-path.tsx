import { routeContext } from '../_site';
import { detailRoutePath } from './splat-detail-route-path';

const specialRoutes: Record<string, { pathname: string; parameter: 'slug' | 'type' }> = {
  'findings/types': { pathname: '/finding-type', parameter: 'type' },
  'projects/experiments': { pathname: '/experiment-detail', parameter: 'slug' },
};

export function requestForPath(pathname: string, search = '') {
  const { locale, pathname: localizedPathname } = routeContext(pathname);

  const splat = localizedPathname.replace(/^\//, '');

  const [first, second, third] = splat.split('/');

  const specialRoute = specialRoutes[`${first}/${second}`];

  if (specialRoute) {
    return specialRoute.parameter === 'type'
      ? { locale, pathname: specialRoute.pathname, type: third, search }
      : { locale, pathname: specialRoute.pathname, slug: third, search };
  }
  if (second) {
    return { locale, pathname: detailRoutePath(first), slug: second, search };
  }
  return { locale, pathname: `/${first}`, search };
}
