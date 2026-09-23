import { createFileRoute } from '@tanstack/react-router';
import { getSsrQueryData, shellQueryOptions } from '../data/queries';
import { LocaleLayout } from './site--locale-layout';
import { routeContext } from './site-route-context';

export const Route = createFileRoute('/_site')({
  loader: async ({ context, location }) => {
    const { locale } = routeContext(location.pathname);

    return getSsrQueryData({
      queryClient: context.queryClient,
      options: shellQueryOptions(locale),
      fallback: undefined,
    });
  },
  component: LocaleLayout,
});

export { routeContext } from './site-route-context';
