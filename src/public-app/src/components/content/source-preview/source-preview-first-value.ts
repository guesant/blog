export function sourcePreviewFirstValue(values: Array<string | undefined>): string | undefined {
  return values.find(Boolean);
}
