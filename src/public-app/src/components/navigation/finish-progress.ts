import NProgress from 'nprogress';
import { navigationProgressState } from './navigation-progress-state';

export function finishProgress() {
  const wasActive = navigationProgressState.active;

  if (navigationProgressState.fallbackTimer) {
    clearTimeout(navigationProgressState.fallbackTimer);
  }

  navigationProgressState.fallbackTimer = undefined;
  NProgress.done();
  document.documentElement.removeAttribute('data-navigation-state');
  document.body.removeAttribute('aria-busy');

  if (!wasActive) {
    return;
  }

  document.body.style.overflow = navigationProgressState.bodyOverflow;
  document.documentElement.style.overflow = navigationProgressState.documentOverflow;
  navigationProgressState.bodyOverflow = '';
  navigationProgressState.documentOverflow = '';
  navigationProgressState.active = false;
  window.scrollTo({ top: 0, behavior: 'auto' });
}
