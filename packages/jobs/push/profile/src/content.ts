import {
  getContactEmail,
  getProfile,
  getResume,
  getSiteText,
} from '../../../../content/src/server.ts';
import type { Profile, ResumeContent, SiteText } from '../../../../content/src/types.ts';

export type ProfileReadmeSource = {
  profile: Profile;
  resume: ResumeContent;
  site: SiteText;
  email: string;
};

export async function loadProfileReadmeSource(): Promise<ProfileReadmeSource> {
  const [profile, resume, site, email] = await Promise.all([
    getProfile('en'),
    getResume('en'),
    getSiteText('en'),
    getContactEmail(),
  ]);

  return { profile, resume, site, email };
}
