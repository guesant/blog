'use client';

import { Box, Typography } from '../../ui';
import { ConditionalContent } from '../../primitives/conditional-content';
import { ExternalLink } from '../../primitives/external-link';
import type { TechnicalProductionEntriesProps } from './types';
import { ResumeEntryHeading } from './resume-entry-heading';
import { EntryDescription } from './entry-description';
import { ResumeEntries } from './resume-entries';

export function TechnicalProductionEntries(props: TechnicalProductionEntriesProps) {
  const { items } = props;

  return (
    <ResumeEntries items={items}>
      {(item) => (
        <Box key={`${item.name}-${item.period}`}>
          <ResumeEntryHeading item={item}>
            <ConditionalContent
              condition={Boolean(item.kind)}
              content={
                <Typography
                  variant="body2"
                  color="text.secondary"
                  visualVariant="technicalProductionEntries"
                >
                  {item.kind}
                  <ConditionalContent
                    condition={Boolean(item.projectHref?.trim())}
                    content={
                      <ExternalLink
                        href={item.projectHref ?? ''}
                        children={` · ${item.projectHref ?? ''}`}
                      />
                    }
                  />
                </Typography>
              }
            />
          </ResumeEntryHeading>
          <EntryDescription description={item.description} />
        </Box>
      )}
    </ResumeEntries>
  );
}
