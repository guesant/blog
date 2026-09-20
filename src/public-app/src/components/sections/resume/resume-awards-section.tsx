import type { ResumeCredentialsProps } from './types';
import { AwardEntries } from './award-entries';
import { ResumeOptionalSection } from './resume-optional-section';
import { ResumeSection } from './resume-section';

type ResumeAwardsSectionProps = ResumeCredentialsProps;

export function ResumeAwardsSection(props: ResumeAwardsSectionProps) {
  return (
    <ResumeOptionalSection
      condition={props.resume.awards.length > 0}
      content={
        <ResumeSection
          title={props.t('awards')}
          children={<AwardEntries items={props.resume.awards} />}
        />
      }
    />
  );
}
