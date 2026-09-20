import { devOverlaySelector, nativeCursorSelector } from './contextual-cursor-selectors';

export function shouldIgnorePointerEvent(event: PointerEvent, devOverlayOpen: boolean) {
  if (devOverlayOpen) {
    return true;
  }

  const eventTarget = event.target instanceof Element ? event.target : null;

  return [devOverlaySelector, nativeCursorSelector].some((selector) =>
    Boolean(eventTarget?.closest(selector)),
  );
}
