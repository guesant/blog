import type { ProtectedEmailChallenge } from './types.ts';

type TamperableChallengeField = 'ciphertext' | 'iv' | 'salt';

export function createTamperedChallenge(
  challenge: ProtectedEmailChallenge,
  field: TamperableChallengeField,
): ProtectedEmailChallenge {
  const value = challenge[field];

  const replacement = value.at(-2) === 'A' ? 'B' : 'A';

  return {
    ...challenge,
    [field]: value.slice(0, -2) + replacement,
  };
}
