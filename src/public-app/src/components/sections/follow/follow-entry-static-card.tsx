import { Card } from '../../ui';
import type { FollowEntry } from './types';
import { FollowEntryCardContent } from './follow-entry-card-content';

type FollowEntryStaticCardProps = {
  entry: FollowEntry;
};

export function FollowEntryStaticCard(props: FollowEntryStaticCardProps) {
  return (
    <Card key={props.entry.key} variant="outlined" visualVariant="renderFollowEntryCard2">
      <FollowEntryCardContent entry={props.entry} />
    </Card>
  );
}
