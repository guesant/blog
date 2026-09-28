'use client';

import { ResumeTrajectoryListFrame } from '../../ui';
import type { TrajectoryEntriesProps } from './types';
import { TrajectoryEntry } from './trajectory-entry';

export function TrajectoryEntries(props: TrajectoryEntriesProps) {
  const { items } = props;

  return (
    <ResumeTrajectoryListFrame>
      {items.map((item) => (
        <TrajectoryEntry key={`${item.organization}-${item.period}`} item={item} />
      ))}
    </ResumeTrajectoryListFrame>
  );
}
