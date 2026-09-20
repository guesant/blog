'use client';

import { Box } from '../../ui';
import type { TrajectoryEntriesProps } from './types';
import { TrajectoryEntry } from './trajectory-entry';

export function TrajectoryEntries(props: TrajectoryEntriesProps) {
  const { items } = props;

  return (
    <Box visualVariant="trajectoryEntries">
      {items.map((item) => (
        <TrajectoryEntry key={`${item.organization}-${item.period}`} item={item} />
      ))}
    </Box>
  );
}
