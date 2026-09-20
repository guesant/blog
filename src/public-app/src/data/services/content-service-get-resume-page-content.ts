import {
  getLocalizedProfile,
  getLocalizedResume,
  getLocalizedSiteText,
  getSelectedResumeCases,
} from '../api/public-site-source.ts';
import type { ResumePageContent } from '../domain/types.ts';
import { getResumePageCopy } from './content-service-get-resume-page-copy';

export async function getResumePageContent(locale?: string): Promise<ResumePageContent> {
  const [cases, resume, page] = await Promise.all([
    getSelectedResumeCases(locale),
    getLocalizedResume(locale),
    getResumePageCopy(locale),
  ]);

  return {
    profile: await getLocalizedProfile(locale),
    site: await getLocalizedSiteText(locale),
    resume,
    page,
    cases,
  };
}
