import { gcm } from '@noble/ciphers/aes.js';
import { toBase64Url } from './codec.ts';
import { DEFAULT_ARGON2ID_PARAMS } from './params.ts';
import { deriveProtectedEmailKey, encoder } from './shared.ts';
import type { Argon2idParams, ProtectedEmailChallenge } from './types.ts';

const saltLength = 16;

const ivLength = 12;

export async function createEmailChallenge(
  email: string,
  params: Argon2idParams = DEFAULT_ARGON2ID_PARAMS,
): Promise<ProtectedEmailChallenge> {
  const salt = crypto.getRandomValues(new Uint8Array(saltLength));

  const iv = crypto.getRandomValues(new Uint8Array(ivLength));

  const key = await deriveProtectedEmailKey(salt, params);

  const ciphertext = gcm(key, iv).encrypt(encoder.encode(email));

  return {
    version: 2,
    algorithm: 'argon2id-aes256gcm',
    salt: toBase64Url(salt),
    iv: toBase64Url(iv),
    ciphertext: toBase64Url(ciphertext),
    params,
  };
}
