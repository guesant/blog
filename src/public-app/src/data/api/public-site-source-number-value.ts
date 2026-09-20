export function numberValue(value: unknown): number | undefined {
  return typeof value === 'number' ? value : undefined;
}
