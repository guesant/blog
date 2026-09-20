export function isPlainPrimaryClick(event: MouseEvent) {
  if (event.defaultPrevented || event.button !== 0) {
    return false;
  }
  if ([event.metaKey, event.ctrlKey, event.shiftKey, event.altKey].some(Boolean)) {
    return false;
  }
  return true;
}
