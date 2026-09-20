import { interactiveSelector } from './contextual-cursor-selectors';

export function getInteractiveElement(event: PointerEvent) {
  const eventTarget = event.target instanceof Element ? event.target : null;

  return eventTarget?.closest<HTMLElement>(interactiveSelector) ?? null;
}
