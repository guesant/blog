import type { ProtectedEmailChallenge } from '../domain/protected-email/types.ts';
import type { SiteText } from '../domain/types.ts';
import type { RecordValue } from './public-site-source-support';
import { recordList } from './public-site-source-list';

export function siteContact(
  site: RecordValue,
  emailChallenge: ProtectedEmailChallenge | undefined,
): SiteText['contact'] {
  const contactEnabled = site.contact_enabled !== false;

  const emailAvailable =
    site.contact_email_available === true ||
    (site.contact_email_available === undefined && site.contact_available === true);

  return {
    enabled: contactEnabled,
    hasEmail: emailChallenge !== undefined || emailAvailable,
    emailChallenge,
    profiles: recordList<SiteText['contact']['profiles'][number]>(site.contact_profiles),
    available: site.contact_available === true,
  };
}
