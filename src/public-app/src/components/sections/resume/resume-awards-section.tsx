import type { ResumeCredentialsProps } from './types';
import { AwardEntries } from './award-entries';
import { ResumeCredentialSection } from './resume-credential-section';

type ResumeAwardsSectionProps = ResumeCredentialsProps;

export function ResumeAwardsSection(props: ResumeAwardsSectionProps) {
  return (
    <ResumeCredentialSection
      condition={props.resume.awards.length > 0}
      title={props.t('awards')}
      entries={<AwardEntries items={props.resume.awards} />}
    />
  );
}
