import type { ProtectedEmailChallenge } from '../domain/protected-email/types.ts';
import type { SiteText } from '../domain/types.ts';
import type { RecordValue } from './public-site-source-support';
import { recordList } from './public-site-source-list';

export function siteContact(
  site: RecordValue,
  emailChallenge: ProtectedEmailChallenge | undefined,
): SiteText['contact'] {
  return {
    hasEmail: emailChallenge !== undefined,
    emailChallenge,
    profiles: recordList<SiteText['contact']['profiles'][number]>(site.contact_profiles),
    available: site.contact_available === true,
  };
}
