'use client';

import { useRouterState } from '@tanstack/react-router';
import { useIsFetching } from '@tanstack/react-query';
import { useEffect } from 'react';
import NProgress from 'nprogress';
import { finishProgress } from './finish-progress';
import { handleNavigationClick } from './handle-navigation-click';
import { startProgress } from './start-progress';

export function NavigationProgress() {
  const routerStatus = useRouterState({ select: (state) => state.status });

  const fetchingCount = useIsFetching();

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

  useEffect(() => {
    if (routerStatus === 'idle' && fetchingCount === 0) {
      finishProgress();
    }
  }, [fetchingCount, routerStatus]);

  return null;
}
