import type { ResumeCredentialsProps } from './types';
import { ResumeOptionalSection } from './resume-optional-section';
import { ResumeSection } from './resume-section';
import { TechnicalProductionEntries } from './technical-production-entries';

type ResumeTechnicalProductionSectionProps = ResumeCredentialsProps;

export function ResumeTechnicalProductionSection(props: ResumeTechnicalProductionSectionProps) {
  return (
    <ResumeOptionalSection
      condition={props.resume.technicalProductions.length > 0}
      content={
        <ResumeSection
          title={props.t('technicalProductions')}
          children={<TechnicalProductionEntries items={props.resume.technicalProductions} />}
        />
      }
    />
  );
}
