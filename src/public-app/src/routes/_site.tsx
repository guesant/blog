import { createFileRoute } from '@tanstack/react-router';
import { shellQueryOptions } from '../data/queries';
import { LocaleLayout } from './site--locale-layout';
import { routeContext } from './site-route-context';

export const Route = createFileRoute('/_site')({
  loader: ({ context, location }) => {
    const { locale } = routeContext(location.pathname);

    return context.queryClient.ensureQueryData(shellQueryOptions(locale));
  },
  component: LocaleLayout,
});

export { routeContext } from './site-route-context';
