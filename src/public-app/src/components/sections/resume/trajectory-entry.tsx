'use client';

import {
  ResumeEntryBlockFrame,
  ResumeEntryGridFrame,
  ResumeEntryTitle,
  ResumeHighlightItem,
  ResumeTrajectoryHighlightsFrame,
  ResumeTrajectoryRole,
} from '../../ui';
import type { TrajectoryItem } from './types';
import { EntryPeriod } from './entry-period';

type TrajectoryEntryProps = {
  item: TrajectoryItem;
};

export function TrajectoryEntry(props: TrajectoryEntryProps) {
  const { item } = props;

  return (
    <ResumeEntryBlockFrame>
      <ResumeEntryGridFrame>
        <ResumeEntryTitle>{item.organization}</ResumeEntryTitle>
        <EntryPeriod period={item.period} />
        <ResumeTrajectoryRole>{item.role}</ResumeTrajectoryRole>
      </ResumeEntryGridFrame>
      <ResumeTrajectoryHighlightsFrame>
        {(item.highlights ?? []).map((highlight) => (
          <ResumeHighlightItem key={highlight} highlight={highlight} />
        ))}
      </ResumeTrajectoryHighlightsFrame>
    </ResumeEntryBlockFrame>
  );
}
