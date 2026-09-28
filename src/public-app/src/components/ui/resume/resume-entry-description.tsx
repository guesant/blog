import type { ReactNode } from 'react';
import { Typography } from '../typography';

type ResumeEntryDescriptionProps = { children: ReactNode };

const descriptionStyles = { marginBlockStart: 'var(--site-space-1)' };

export function ResumeEntryDescription(props: ResumeEntryDescriptionProps) {
  return (
    <Typography variant="body2" color="text.secondary" sx={descriptionStyles}>
      {props.children}
    </Typography>
  );
}
