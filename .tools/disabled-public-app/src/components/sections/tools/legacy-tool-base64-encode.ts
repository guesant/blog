export function base64Encode(value: string) {
  return btoa(unescape(encodeURIComponent(value)));
}
