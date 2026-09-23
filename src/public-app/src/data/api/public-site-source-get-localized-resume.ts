import type { ResumeContent } from '../domain/types.ts';
import { getSiteResume } from './public-site-generated-client';
import { apiClient } from './public-site-source-api-client';
import { RecordValue } from './public-site-source-support';
import { objectValue } from './public-site-source-object-value';
import { recordList } from './public-site-source-list';
import { stringValue } from './public-site-source-string-value';

export async function getLocalizedResume(locale?: string): Promise<ResumeContent> {
  const result = await getSiteResume({ client: apiClient(), query: { locale } });

  const resume = objectValue(result.data) ?? {};

  return {
    experience: recordList<ResumeContent['experience'][number]>(resume.experience),
    summary: stringValue(resume.summary),
    skills: recordList<RecordValue>(resume.skills).map((skill) => ({
      label: stringValue(skill.name),
      items: recordList<RecordValue>(skill.technologies).map((technology) =>
        stringValue(technology.name ?? technology.slug),
      ),
    })),
    languages: recordList<ResumeContent['languages'][number]>(resume.languages),
    selectedCases: recordList<RecordValue>(resume.selected_cases).map((item) => ({
      item: String(item.slug ?? ''),
    })),
    leadership: recordList<ResumeContent['leadership'][number]>(resume.leadership),
    education: recordList<ResumeContent['education'][number]>(resume.education),
    certificates: recordList<ResumeContent['certificates'][number]>(resume.certificates),
    certifications: recordList<ResumeContent['certifications'][number]>(resume.certifications),
    publications: recordList<ResumeContent['publications'][number]>(resume.publications),
    recommendations: recordList<ResumeContent['recommendations'][number]>(resume.recommendations),
    technicalProductions: recordList<ResumeContent['technicalProductions'][number]>(
      resume.technical_productions,
    ),
    events: recordList<ResumeContent['events'][number]>(resume.events),
    awards: recordList<ResumeContent['awards'][number]>(resume.awards),
  };
}
