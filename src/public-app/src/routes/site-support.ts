import { createFileRoute } from '@tanstack/react-router';
import { shellQueryOptions } from '../data/queries';
import { routeContext } from './site-route-context';
import { LocaleLayout } from './site--locale-layout';

export const Route = createFileRoute('/site-support')({
  loader: ({ context, location }) => {
    const { locale } = routeContext(location.pathname);

    return context.queryClient.ensureQueryData(shellQueryOptions(locale));
  },
  component: LocaleLayout,
});
