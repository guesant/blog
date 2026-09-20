'use client';

import { Box, Typography } from '../../ui';
import type { TrajectoryItem } from './types';
import { HighlightItem } from './highlight-item';
import { ResumeEntryGrid } from './resume-entry-grid';
import { EntryPeriod } from './entry-period';

type TrajectoryEntryProps = {
  item: TrajectoryItem;
};

export function TrajectoryEntry(props: TrajectoryEntryProps) {
  const { item } = props;

  return (
    <Box>
      <ResumeEntryGrid>
        <Typography visualVariant="trajectoryEntry">{item.organization}</Typography>
        <EntryPeriod period={item.period} />
        <Typography variant="body2" visualVariant="trajectoryEntry2">
          {item.role}
        </Typography>
      </ResumeEntryGrid>
      <Box component="ul" visualVariant="trajectoryEntry">
        {(item.highlights ?? []).map((highlight) => (
          <HighlightItem key={highlight} highlight={highlight} />
        ))}
      </Box>
    </Box>
  );
}
