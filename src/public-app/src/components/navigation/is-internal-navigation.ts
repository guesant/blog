import { shouldSkipNavigation } from './should-skip-navigation';

export function isInternalNavigation(event: MouseEvent, anchor: HTMLAnchorElement) {
  if (shouldSkipNavigation(event, anchor)) {
    return false;
  }

  const destination = new URL(anchor.href, window.location.href);

  const current = new URL(window.location.href);

  if (
    destination.origin !== current.origin ||
    !['http:', 'https:'].includes(destination.protocol)
  ) {
    return false;
  }

  return !(destination.pathname === current.pathname && destination.search === current.search);
}
