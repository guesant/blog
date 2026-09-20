import { copyBytes } from './copy-bytes';

type DecryptWithWebCryptoProps = {
  keyBytes: Uint8Array<ArrayBufferLike>;
  iv: Uint8Array<ArrayBufferLike>;
  ciphertext: Uint8Array<ArrayBufferLike>;
};

export async function decryptWithWebCrypto(
  props: DecryptWithWebCryptoProps,
): Promise<Uint8Array<ArrayBufferLike>> {
  const cryptoKeyBytes = copyBytes(props.keyBytes);

  const cryptoIv = copyBytes(props.iv);

  const cryptoCiphertext = copyBytes(props.ciphertext);

  const key = await globalThis.crypto.subtle.importKey(
    'raw',
    cryptoKeyBytes,
    { name: 'AES-GCM' },
    false,
    ['decrypt'],
  );

  const plaintext = await globalThis.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: cryptoIv },
    key,
    cryptoCiphertext,
  );

  return new Uint8Array(plaintext);
}
