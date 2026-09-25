export function numberOrZero(value: unknown): number {
  return typeof value === 'number' ? value : 0;
}
