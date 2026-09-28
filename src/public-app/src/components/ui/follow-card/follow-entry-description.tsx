import type { ReactNode } from 'react';
import { Typography } from '../typography';

type FollowEntryDescriptionProps = { children: ReactNode };

export function FollowEntryDescription(props: FollowEntryDescriptionProps) {
  return <Typography color="text.secondary">{props.children}</Typography>;
}
