import NProgress from 'nprogress';
import { navigationProgressState } from './navigation-progress-state';

export function finishProgress() {
  if (navigationProgressState.fallbackTimer) {
    clearTimeout(navigationProgressState.fallbackTimer);
  }
  navigationProgressState.fallbackTimer = undefined;
  NProgress.done();
  document.documentElement.removeAttribute('data-navigation-state');
  document.body.removeAttribute('aria-busy');
}
