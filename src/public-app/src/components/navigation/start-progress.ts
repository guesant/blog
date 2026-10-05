import NProgress from 'nprogress';
import { finishProgress } from './finish-progress';
import { navigationProgressState } from './navigation-progress-state';

export function startProgress() {
  if (navigationProgressState.fallbackTimer) {
    clearTimeout(navigationProgressState.fallbackTimer);
  }

  if (!navigationProgressState.active) {
    navigationProgressState.active = true;
  }

  document.documentElement.setAttribute('data-navigation-state', 'loading');
  document.body.setAttribute('aria-busy', 'true');
  NProgress.start();
  navigationProgressState.fallbackTimer = setTimeout(finishProgress, 12_000);
}
