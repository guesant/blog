import { Card } from '../../ui';
import type { FollowEntry } from './types';
import { FollowEntryCardContent } from './follow-entry-card-content';

type FollowEntryLinkCardProps = {
  entry: FollowEntry;
};

export function FollowEntryLinkCard(props: FollowEntryLinkCardProps) {
  return (
    <Card
      key={props.entry.key}
      component="a"
      href={props.entry.url ?? '#'}
      variant="outlined"
      visualVariant="renderFollowEntryCard"
    >
      <FollowEntryCardContent entry={props.entry} />
    </Card>
  );
}
