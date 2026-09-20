export function words(value: string) {
  return value.trim().match(/[\p{L}\p{N}]+/gu) ?? [];
}
