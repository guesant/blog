export function getTargetRadius(element: HTMLElement, width: number, height: number) {
  const rawRadius = getComputedStyle(element).borderTopLeftRadius;

  const parsedRadius = Number.parseFloat(rawRadius) || 0;

  const radius = rawRadius.endsWith('%')
    ? Math.min(width, height) * (parsedRadius / 100)
    : parsedRadius + 6;

  return Math.min(radius, width / 2, height / 2);
}
