'use client';

import { TimelineRow } from '../../content/timeline-row';
import type { Profile } from '@portfolio/data/domain/types';

type ProfileTrajectoryItemProps = {
  item: Profile['trajectory'][number];
};

export function ProfileTrajectoryItem(props: ProfileTrajectoryItemProps) {
  return (
    <TimelineRow
      rail={props.item.period}
      title={props.item.role}
      subtitle={props.item.organization}
      body={(props.item.highlights ?? []).join(' ')}
    />
  );
}
