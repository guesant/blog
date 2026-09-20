import { getLocalizedPage } from '../api/public-site-source.ts';
import type { ResumePageCopy } from '../domain/types.ts';

export async function getResumePageCopy(locale?: string): Promise<ResumePageCopy> {
  return getLocalizedPage<ResumePageCopy>('resume', locale);
}
