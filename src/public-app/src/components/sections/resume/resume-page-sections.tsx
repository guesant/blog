import type { useTranslations } from '@/i18n/compat';
import type { ResumePageContentProps } from './types';
import { ResumeCredentials } from './resume-credentials';
import { ResumeOverviewSections } from './resume-overview-sections';
import { ResumeQualificationSections } from './resume-qualification-sections';
import { ResumeWorkSections } from './resume-work-sections';

type ResumePageSectionsProps = {
  content: ResumePageContentProps['content'];
  t: ReturnType<typeof useTranslations>;
};

export function ResumePageSections(props: ResumePageSectionsProps) {
  const resume = props.content.resume;

  const experience = props.content.resume.experience.map((item) => ({ item }));

  return (
    <>
      <ResumeOverviewSections resume={resume} t={props.t} />
      <ResumeWorkSections cases={props.content.cases} experience={experience} t={props.t} />
      <ResumeQualificationSections resume={resume} t={props.t} />
      <ResumeCredentials resume={resume} t={props.t} />
    </>
  );
}
