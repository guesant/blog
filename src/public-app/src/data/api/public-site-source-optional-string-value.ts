export function optionalStringValue(value: unknown): string | undefined {
  return value ? String(value) : undefined;
}
