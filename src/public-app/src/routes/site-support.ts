import { createFileRoute } from '@tanstack/react-router';
import { fallbackShellData, getSsrQueryData, shellQueryOptions } from '../data/queries';
import { routeContext } from './site-route-context';
import { LocaleLayout } from './site--locale-layout';

export const Route = createFileRoute('/site-support')({
  loader: async ({ context, location }) => {
    const { locale } = routeContext(location.pathname);

    return getSsrQueryData({
      queryClient: context.queryClient,
      options: shellQueryOptions(locale),
      fallback: fallbackShellData,
    });
  },
  component: LocaleLayout,
});
