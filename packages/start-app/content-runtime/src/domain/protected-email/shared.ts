import { argon2id } from 'hash-wasm';
import type { Argon2idParams } from './types.ts';

type KeyUsages = Parameters<typeof crypto.subtle.importKey>[4];
type ImportedCryptoKey = Awaited<ReturnType<typeof crypto.subtle.importKey>>;

/**
 * IMPORTANT: public by design — only seeds Argon2id, it's not a secret. The
 * actual protection comes from the per-challenge random salt plus the Argon2id
 * memory/time cost, not from hiding this string.
 */
export const challengePassword = 'portfolio-contact-challenge-v1';

export const encoder = new TextEncoder();
export const decoder = new TextDecoder();

export async function deriveAesGcmKey(
  salt: Uint8Array<ArrayBuffer>,
  params: Argon2idParams,
  usages: KeyUsages,
): Promise<ImportedCryptoKey> {
  const keyBytes = await argon2id({
    password: challengePassword,
    salt,
    parallelism: params.parallelism,
    iterations: params.iterations,
    memorySize: params.memorySize,
    hashLength: params.hashLength,
    outputType: 'binary',
  });

  return crypto.subtle.importKey(
    'raw',
    new Uint8Array(keyBytes),
    { name: 'AES-GCM' },
    false,
    usages,
  );
}
