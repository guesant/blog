import { createFileRoute } from '@tanstack/react-router';
import { fallbackShellData, getStaleQueryData, shellQueryOptions } from '../data/queries';
import { routeContext } from './site-route-context';
import { LocaleLayout } from './site--locale-layout';

export const Route = createFileRoute('/site-support')({
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
