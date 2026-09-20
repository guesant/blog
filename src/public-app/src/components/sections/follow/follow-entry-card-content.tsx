import { Typography } from '../../ui';
import type { FollowEntry } from './types';

type FollowEntryCardContentProps = {
  entry: FollowEntry;
};

export function FollowEntryCardContent(props: FollowEntryCardContentProps) {
  return (
    <>
      <Typography component="h2" variant="h5">
        {props.entry.title}
      </Typography>
      <Typography color="text.secondary" visualVariant="renderFollowEntryCard">
        {props.entry.description}
      </Typography>
    </>
  );
}
