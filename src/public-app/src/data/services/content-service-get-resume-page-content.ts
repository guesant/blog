import {
  getLocalizedProfile,
  getLocalizedResume,
  getLocalizedSiteText,
  getSelectedResumeCases,
} from '../api/public-site-source.ts';
import type { ResumePageContent } from '../domain/types.ts';
import { getResumePageCopy } from './content-service-get-resume-page-copy';

export async function getResumePageContent(
  locale?: string,
  shell?: Pick<ResumePageContent, 'profile' | 'site'>,
): Promise<ResumePageContent> {
  const [cases, resume, page] = await Promise.all([
    getSelectedResumeCases(locale),
    getLocalizedResume(locale),
    getResumePageCopy(locale),
  ]);

  return {
    profile: shell?.profile ?? (await getLocalizedProfile(locale)),
    site: shell?.site ?? (await getLocalizedSiteText(locale)),
    resume,
    page,
    cases,
  };
}
