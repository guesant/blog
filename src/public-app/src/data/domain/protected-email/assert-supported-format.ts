import type { ProtectedEmailChallenge } from './types.ts';
import { ProtectedEmailChallengeError } from './challenge-error.ts';

export function assertSupportedFormat(challenge: ProtectedEmailChallenge) {
  if (challenge.version !== 2) {
    throw new ProtectedEmailChallengeError(`Unsupported challenge version: ${challenge.version}`);
  }
  if (challenge.algorithm !== 'argon2id-aes256gcm') {
    throw new ProtectedEmailChallengeError(
      `Unsupported challenge algorithm: ${challenge.algorithm}`,
    );
  }
}
