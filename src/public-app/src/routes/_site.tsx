import { createFileRoute } from '@tanstack/react-router';
import { fallbackShellData, getStaleQueryData, shellQueryOptions } from '../data/queries';
import { LocaleLayout } from './site--locale-layout';
import { routeContext } from './site-route-context';

export const Route = createFileRoute('/_site')({
  loader: ({ context, location }) => {
    const { locale } = routeContext(location.pathname);

    return getStaleQueryData({
      queryClient: context.queryClient,
      options: shellQueryOptions(locale),
      fallback: fallbackShellData,
    });
  },
  component: LocaleLayout,
});

export { routeContext } from './site-route-context';
