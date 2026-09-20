export function hasContentFeedValue(values: string[]): boolean {
  return Boolean(values.find(Boolean));
}
