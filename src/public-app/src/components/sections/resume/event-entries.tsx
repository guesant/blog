'use client';

import { Typography } from '../../ui';
import type { EventEntriesProps } from './types';
import { ResumeEntryHeading } from './resume-entry-heading';
import { ResumeEntries } from './resume-entries';

export function EventEntries(props: EventEntriesProps) {
  return (
    <ResumeEntries items={props.items}>
      {(item) => {
        const details = [item.role, item.talkTitle?.trim(), item.location?.trim()]
          .filter(Boolean)
          .join(' · ');

        return (
          <ResumeEntryHeading key={`${item.name}-${item.period}`} item={item}>
            <Typography variant="body2" color="text.secondary" visualVariant="eventEntries">
              {details}
            </Typography>
          </ResumeEntryHeading>
        );
      }}
    </ResumeEntries>
  );
}
