export function numbers(value: string) {
  return value
    .split(/[;,\s]+/)
    .map(Number)
    .filter((item) => Number.isFinite(item));
}
