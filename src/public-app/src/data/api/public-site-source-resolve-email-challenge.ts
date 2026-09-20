import type { ProtectedEmailChallenge } from '../domain/protected-email/types.ts';
import type { RecordValue } from './public-site-source-support';
import { emailChallengeValue } from './public-site-source-email-challenge';
import { getEmailChallenge } from './public-site-source-get-email-challenge';

export async function resolveEmailChallenge(
  site: RecordValue,
): Promise<ProtectedEmailChallenge | undefined> {
  const existing = emailChallengeValue(site.protected_email);

  return existing ?? (site.contact_available === true ? getEmailChallenge() : undefined);
}
