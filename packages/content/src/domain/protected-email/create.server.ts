import { toBase64Url } from './codec.ts';
import { DEFAULT_ARGON2ID_PARAMS } from './params.ts';
import { deriveAesGcmKey, encoder } from './shared.ts';
import type { Argon2idParams, ProtectedEmailChallenge } from './types.ts';

const saltLength = 16;
const ivLength = 12;

export async function createEmailChallenge(
  email: string,
  params: Argon2idParams = DEFAULT_ARGON2ID_PARAMS,
): Promise<ProtectedEmailChallenge> {
  const salt = crypto.getRandomValues(new Uint8Array(saltLength));
  const iv = crypto.getRandomValues(new Uint8Array(ivLength));
  const key = await deriveAesGcmKey(salt, params, ['encrypt']);
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode(email),
  );

  return {
    version: 2,
    algorithm: 'argon2id-aes256gcm',
    salt: toBase64Url(salt),
    iv: toBase64Url(iv),
    ciphertext: toBase64Url(new Uint8Array(ciphertext)),
    params,
  };
}
