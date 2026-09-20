'use client';

import { Box, Typography } from '../../ui';
import type { AwardEntriesProps } from './types';
import { ResumeEntryHeading } from './resume-entry-heading';
import { EntryDescription } from './entry-description';
import { ResumeEntries } from './resume-entries';

export function AwardEntries(props: AwardEntriesProps) {
  const { items } = props;

  return (
    <ResumeEntries items={items}>
      {(item) => (
        <Box key={`${item.name}-${item.period}`}>
          <ResumeEntryHeading item={item}>
            <Typography variant="body2" color="text.secondary" visualVariant="awardEntries">
              {item.issuer}
            </Typography>
          </ResumeEntryHeading>
          <EntryDescription description={item.description} />
        </Box>
      )}
    </ResumeEntries>
  );
}
