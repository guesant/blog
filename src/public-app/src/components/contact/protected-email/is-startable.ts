import type { ProtectedEmailChallenge } from '@portfolio/data/domain/protected-email';
import type { RevealState } from './types';

export function isStartable(
  challenge: ProtectedEmailChallenge | undefined,
  state: RevealState,
  available = false,
) {
  return (challenge !== undefined || available) && (state === 'idle' || state === 'error');
}
