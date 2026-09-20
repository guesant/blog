export function base64Decode(value: string) {
  return decodeURIComponent(escape(atob(value.trim())));
}
