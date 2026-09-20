import type { ResumeCredentialsProps } from './types';
import { EventEntries } from './event-entries';
import { ResumeOptionalSection } from './resume-optional-section';
import { ResumeSection } from './resume-section';

type ResumeEventsSectionProps = ResumeCredentialsProps;

export function ResumeEventsSection(props: ResumeEventsSectionProps) {
  return (
    <ResumeOptionalSection
      condition={props.resume.events.length > 0}
      content={
        <ResumeSection
          title={props.t('events')}
          children={<EventEntries items={props.resume.events} />}
        />
      }
    />
  );
}
