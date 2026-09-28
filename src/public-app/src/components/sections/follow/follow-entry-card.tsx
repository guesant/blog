import { FollowEntryCardFrame } from '../../ui';
import type { FollowEntry } from './types';
import { FollowEntryCardContent } from './follow-entry-card-content';

type FollowEntryCardProps = {
  entry: FollowEntry;
};

export function FollowEntryCard(props: FollowEntryCardProps) {
  return (
    <FollowEntryCardFrame href={props.entry.url}>
      <FollowEntryCardContent entry={props.entry} />
    </FollowEntryCardFrame>
  );
}
