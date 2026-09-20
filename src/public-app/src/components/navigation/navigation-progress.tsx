'use client';

import { usePathname } from '../../i18n/compat';
import NProgress from 'nprogress';
import { useEffect } from 'react';
import { finishProgress } from './finish-progress';
import { handleNavigationClick } from './handle-navigation-click';
import { startProgress } from './start-progress';

export function NavigationProgress() {
  const pathname = usePathname();

  useEffect(() => {
    NProgress.configure({
      showSpinner: false,
      minimum: 0.12,
      speed: 180,
      trickleSpeed: 140,
    });

    document.addEventListener('click', handleNavigationClick, true);
    window.addEventListener('popstate', startProgress);
    window.addEventListener('pageshow', finishProgress);

    return () => {
      document.removeEventListener('click', handleNavigationClick, true);
      window.removeEventListener('popstate', startProgress);
      window.removeEventListener('pageshow', finishProgress);
      finishProgress();
    };
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname intentionally only triggers completion after navigation.
  useEffect(() => {
    finishProgress();
  }, [pathname]);

  return null;
}
