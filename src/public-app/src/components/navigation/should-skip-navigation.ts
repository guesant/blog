import { isPlainPrimaryClick } from './is-plain-primary-click';

export function shouldSkipNavigation(event: MouseEvent, anchor: HTMLAnchorElement) {
  if (!isPlainPrimaryClick(event)) {
    return true;
  }
  return anchor.target === '_blank' || anchor.hasAttribute('download');
}
