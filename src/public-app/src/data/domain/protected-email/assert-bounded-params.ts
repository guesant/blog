import { MAX_ARGON2ID_PARAMS } from './params.ts';
import { ProtectedEmailChallengeError } from './challenge-error.ts';
import type { Argon2idParams } from './types.ts';

export function assertBoundedParams(params: Argon2idParams) {
  const exceeds =
    params.memorySize > MAX_ARGON2ID_PARAMS.memorySize ||
    params.iterations > MAX_ARGON2ID_PARAMS.iterations ||
    params.parallelism > MAX_ARGON2ID_PARAMS.parallelism ||
    params.hashLength > MAX_ARGON2ID_PARAMS.hashLength;

  if (exceeds) {
    throw new ProtectedEmailChallengeError('Challenge params exceed the supported bounds');
  }
}
