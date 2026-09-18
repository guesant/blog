import { fromBase64Url } from './codec.ts';
import { MAX_ARGON2ID_PARAMS } from './params.ts';
import { decoder, deriveAesGcmKey } from './shared.ts';
import type { Argon2idParams, ProtectedEmailChallenge } from './types.ts';

export class ProtectedEmailChallengeError extends Error {}

function assertSupportedFormat(challenge: ProtectedEmailChallenge) {
  if (challenge.version !== 2) {
    throw new ProtectedEmailChallengeError(`Unsupported challenge version: ${challenge.version}`);
  }
  if (challenge.algorithm !== 'argon2id-aes256gcm') {
    throw new ProtectedEmailChallengeError(
      `Unsupported challenge algorithm: ${challenge.algorithm}`,
    );
  }
}

function assertBoundedParams(params: Argon2idParams) {
  const exceeds =
    params.memorySize > MAX_ARGON2ID_PARAMS.memorySize ||
    params.iterations > MAX_ARGON2ID_PARAMS.iterations ||
    params.parallelism > MAX_ARGON2ID_PARAMS.parallelism ||
    params.hashLength > MAX_ARGON2ID_PARAMS.hashLength;

  if (exceeds) {
    throw new ProtectedEmailChallengeError('Challenge params exceed the supported bounds');
  }
}

export async function solveEmailChallenge(challenge: ProtectedEmailChallenge): Promise<string> {
  assertSupportedFormat(challenge);
  assertBoundedParams(challenge.params);

  const salt = fromBase64Url(challenge.salt);
  const key = await deriveAesGcmKey(salt, challenge.params, ['decrypt']);
  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: fromBase64Url(challenge.iv) },
    key,
    fromBase64Url(challenge.ciphertext),
  );

  return decoder.decode(plaintext);
}
