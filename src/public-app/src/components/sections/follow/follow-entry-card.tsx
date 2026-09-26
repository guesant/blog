import { Card } from '../../ui';
import type { FollowEntry } from './types';
import { FollowEntryCardContent } from './follow-entry-card-content';

type FollowEntryCardProps = {
  entry: FollowEntry;
};

export function FollowEntryCard(props: FollowEntryCardProps) {
  const linkProps = props.entry.url
    ? { component: 'a', href: props.entry.url }
    : { component: 'article' };

  return (
    <Card {...linkProps} variant="outlined" visualVariant="followEntryCard">
      <FollowEntryCardContent entry={props.entry} />
    </Card>
  );
}
