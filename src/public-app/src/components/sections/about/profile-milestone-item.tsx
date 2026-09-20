'use client';

import { TimelineRow } from '../../content/timeline-row';
import type { Profile } from '@portfolio/data/domain/types';

type ProfileMilestoneItemProps = {
  item: NonNullable<Profile['milestones']>[number];
};

export function ProfileMilestoneItem(props: ProfileMilestoneItemProps) {
  return (
    <TimelineRow rail={props.item.year} title={props.item.title} body={props.item.description} />
  );
}
