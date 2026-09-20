'use client';

import { Box, Typography } from '../../ui';
import { ConditionalContent } from '../../primitives/conditional-content';
import type { EducationItem } from './types';
import { EntryPeriod } from './entry-period';

type EducationEntryProps = { item: EducationItem };

export function EducationEntry(props: EducationEntryProps) {
  const { item } = props;

  return (
    <Box visualVariant="educationEntry">
      <Typography visualVariant="educationEntry">{item.institution}</Typography>
      <EntryPeriod period={item.period} />
      <Typography variant="body2" visualVariant="educationEntry2">
        {item.degree}
      </Typography>
      <ConditionalContent
        condition={Boolean(item.location)}
        content={
          <Typography variant="body2" color="text.secondary">
            {item.location}
          </Typography>
        }
      />
    </Box>
  );
}
