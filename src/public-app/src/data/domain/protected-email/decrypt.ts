import { gcm } from '@noble/ciphers/aes.js';
import { decryptWithWebCrypto } from './decrypt-with-web-crypto';

export async function decryptProtectedEmail(
  keyBytes: Uint8Array<ArrayBufferLike>,
  iv: Uint8Array<ArrayBufferLike>,
  ciphertext: Uint8Array<ArrayBufferLike>,
): Promise<Uint8Array<ArrayBufferLike>> {
  if (globalThis.crypto?.subtle) {
    return decryptWithWebCrypto({ keyBytes, iv, ciphertext });
  }

  return gcm(keyBytes, iv).decrypt(ciphertext);
}
