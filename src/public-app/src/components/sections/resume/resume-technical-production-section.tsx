import type { ResumeCredentialsProps } from './types';
import { TechnicalProductionEntries } from './technical-production-entries';
import { ResumeCredentialSection } from './resume-credential-section';

type ResumeTechnicalProductionSectionProps = ResumeCredentialsProps;

export function ResumeTechnicalProductionSection(props: ResumeTechnicalProductionSectionProps) {
  return (
    <ResumeCredentialSection
      condition={props.resume.technicalProductions.length > 0}
      title={props.t('technicalProductions')}
      entries={<TechnicalProductionEntries items={props.resume.technicalProductions} />}
    />
  );
}
