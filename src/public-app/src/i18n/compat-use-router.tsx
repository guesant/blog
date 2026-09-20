import { useRouter as useTanStackRouter } from '@tanstack/react-router';
import { localizedPath } from './navigation';
import { NavigationOptions } from './compat-support';
import { useLocale } from './compat-use-locale';

export function useRouter() {
  const router = useTanStackRouter();

  const locale = useLocale();

  const navigate = (href: string, options?: NavigationOptions, replace = false) => {
    const { locale: targetLocale = locale, ...routerOptions } = options ?? {};

    return router.navigate({
      to: localizedPath(href, targetLocale) as never,
      replace,
      ...routerOptions,
    });
  };

  return {
    replace: (href: string, options?: NavigationOptions) => navigate(href, options, true),
    push: (href: string, options?: NavigationOptions) => navigate(href, options),
    back: () => window.history.back(),
    refresh: () => router.invalidate(),
  };
}
