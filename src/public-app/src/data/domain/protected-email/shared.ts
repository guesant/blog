import { argon2id } from 'hash-wasm';
import type { Argon2idParams } from './types.ts';

/**
 * IMPORTANT: public by design — only seeds Argon2id, it's not a secret. The
 * actual protection comes from the per-challenge random salt plus the Argon2id
 * memory/time cost, not from hiding this string.
 */
const challengePassword = 'portfolio-contact-challenge-v1';

export const encoder = new TextEncoder();

export const decoder = new TextDecoder();

export async function deriveProtectedEmailKey(
  salt: Uint8Array<ArrayBufferLike>,
  params: Argon2idParams,
): Promise<Uint8Array<ArrayBufferLike>> {
  const keyBytes = await argon2id({
    password: challengePassword,
    salt,
    parallelism: params.parallelism,
    iterations: params.iterations,
    memorySize: params.memorySize,
    hashLength: params.hashLength,
    outputType: 'binary',
  });

  return new Uint8Array(keyBytes);
}
