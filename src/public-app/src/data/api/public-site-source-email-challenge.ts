import type { ProtectedEmailChallenge } from '../domain/protected-email/types.ts';
import { objectValue } from './public-site-source-object-value';

export function emailChallengeValue(value: unknown): ProtectedEmailChallenge | undefined {
  const candidate = objectValue(value);

  if (!candidate) {
    return undefined;
  }

  const requiredKeys = ['version', 'algorithm', 'salt', 'iv', 'ciphertext'];

  return requiredKeys.every((key) => key in candidate)
    ? (candidate as ProtectedEmailChallenge)
    : undefined;
}
