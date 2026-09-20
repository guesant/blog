export function isVisibleDevOverlay(element: Element) {
  const styles = getComputedStyle(element);

  const isHidden = [
    element.hasAttribute('hidden'),
    element.getAttribute('aria-hidden') === 'true',
    styles.display === 'none',
    styles.visibility === 'hidden',
    styles.opacity === '0',
  ].some(Boolean);

  if (isHidden) {
    return false;
  }

  const { width, height } = element.getBoundingClientRect();

  return width > 0 && height > 0;
}
