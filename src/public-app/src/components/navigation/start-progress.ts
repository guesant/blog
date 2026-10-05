import NProgress from 'nprogress';
import { finishProgress } from './finish-progress';
import { navigationProgressState } from './navigation-progress-state';

export function startProgress() {
  if (navigationProgressState.fallbackTimer) {
    clearTimeout(navigationProgressState.fallbackTimer);
  }

  if (!navigationProgressState.active) {
    navigationProgressState.bodyOverflow = document.body.style.overflow;
    navigationProgressState.documentOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    navigationProgressState.active = true;
  }

  document.documentElement.setAttribute('data-navigation-state', 'loading');
  document.body.setAttribute('aria-busy', 'true');
  NProgress.start();
  navigationProgressState.fallbackTimer = setTimeout(finishProgress, 12_000);
}
