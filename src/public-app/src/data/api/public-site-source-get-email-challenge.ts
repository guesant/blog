import type { ProtectedEmailChallenge } from '../domain/protected-email/types.ts';
import { createProtectedEmailChallenge } from './generated/index.ts';
import { snapshotRequestTtlMs, emailChallengeState } from './public-site-source-support';
import { apiClient } from './public-site-source-api-client';

export async function getEmailChallenge(): Promise<ProtectedEmailChallenge | undefined> {
  const now = Date.now();

  if (emailChallengeState.current && emailChallengeState.current.expiresAt > now) {
    return emailChallengeState.current.promise;
  }

  const promise = createProtectedEmailChallenge({ client: apiClient() })
    .then((result) => (result.data as ProtectedEmailChallenge | undefined) ?? undefined)
    .catch(() => undefined);

  const request = { expiresAt: now + snapshotRequestTtlMs, promise };

  emailChallengeState.current = request;
  promise.then((value) => {
    if (value === undefined && emailChallengeState.current === request) {
      emailChallengeState.current = undefined;
    }
  });
  return promise;
}
