import type { ResumeCredentialsProps } from './types';
import { EventEntries } from './event-entries';
import { ResumeCredentialSection } from './resume-credential-section';

type ResumeEventsSectionProps = ResumeCredentialsProps;

export function ResumeEventsSection(props: ResumeEventsSectionProps) {
  return (
    <ResumeCredentialSection
      condition={props.resume.events.length > 0}
      title={props.t('events')}
      entries={<EventEntries items={props.resume.events} />}
    />
  );
}
