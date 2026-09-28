import type { ReactNode } from 'react';
import { Typography } from '../typography';

type FollowEntryDescriptionProps = { children: ReactNode };

const descriptionStyles = { marginBlockStart: 'var(--site-space-1)' };

export function FollowEntryDescription(props: FollowEntryDescriptionProps) {
  return (
    <Typography color="text.secondary" sx={descriptionStyles}>
      {props.children}
    </Typography>
  );
}
