import type { ReactNode } from 'react';
import { Typography } from '../typography';

type ResumeEntryDescriptionProps = { children: ReactNode };

export function ResumeEntryDescription(props: ResumeEntryDescriptionProps) {
  return (
    <Typography variant="body2" color="text.secondary">
      {props.children}
    </Typography>
  );
}
