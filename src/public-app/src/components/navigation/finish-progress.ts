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

  navigationProgressState.active = false;
  window.scrollTo(0, 0);
  document
    .querySelectorAll<HTMLElement>('[data-navigation-scroll-container]')
    .forEach((element) => {
      element.scrollTop = 0;
      element.scrollLeft = 0;
    });
}
