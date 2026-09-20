export function fromBase64Url(value: string): Uint8Array<ArrayBufferLike> {
  const binary = atob(value.replace(/-/g, '+').replace(/_/g, '/'));

  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}
