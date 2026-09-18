'use client';

import { usePathname } from 'next/navigation';
import NProgress from 'nprogress';
import { useEffect } from 'react';

let fallbackTimer: ReturnType<typeof setTimeout> | undefined;

function finishProgress() {
  if (fallbackTimer) {
    clearTimeout(fallbackTimer);
  }
  fallbackTimer = undefined;
  NProgress.done();
  document.documentElement.removeAttribute('data-navigation-state');
  document.body.removeAttribute('aria-busy');
}

function startProgress() {
  if (fallbackTimer) {
    clearTimeout(fallbackTimer);
  }
  document.documentElement.setAttribute('data-navigation-state', 'loading');
  document.body.setAttribute('aria-busy', 'true');
  NProgress.start();
  fallbackTimer = setTimeout(finishProgress, 12_000);
}

function isPlainPrimaryClick(event: MouseEvent) {
  if (event.defaultPrevented || event.button !== 0) {
    return false;
  }
  if (event.metaKey || event.ctrlKey) {
    return false;
  }
  return !event.shiftKey && !event.altKey;
}

function shouldSkipNavigation(event: MouseEvent, anchor: HTMLAnchorElement) {
  if (!isPlainPrimaryClick(event)) {
    return true;
  }
  return anchor.target === '_blank' || anchor.hasAttribute('download');
}

function isInternalNavigation(event: MouseEvent, anchor: HTMLAnchorElement) {
  if (shouldSkipNavigation(event, anchor)) {
    return false;
  }

  const destination = new URL(anchor.href, window.location.href);
  const current = new URL(window.location.href);

  if (destination.origin !== current.origin) {
    return false;
  }
  if (destination.protocol !== 'http:' && destination.protocol !== 'https:') {
    return false;
  }

  return !(destination.pathname === current.pathname && destination.search === current.search);
}

function handleNavigationClick(event: MouseEvent) {
  if (!(event.target instanceof Element)) {
    return;
  }
  const anchor = event.target.closest('a');
  if (anchor instanceof HTMLAnchorElement && isInternalNavigation(event, anchor)) {
    startProgress();
  }
}

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
