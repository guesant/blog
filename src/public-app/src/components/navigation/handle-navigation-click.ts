import { isInternalNavigation } from './is-internal-navigation';
import { startProgress } from './start-progress';

export function handleNavigationClick(event: MouseEvent) {
  if (!(event.target instanceof Element)) {
    return;
  }

  const anchor = event.target.closest('a');

  if (anchor instanceof HTMLAnchorElement && isInternalNavigation(event, anchor)) {
    startProgress();
  }
}
