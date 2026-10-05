export function boundedListingPage(value: number, pageCount: number) {
  return Math.min(Math.max(value, 1), pageCount);
}
