export function isMousePointer(event: PointerEvent) {
  return !event.pointerType || event.pointerType === 'mouse';
}
