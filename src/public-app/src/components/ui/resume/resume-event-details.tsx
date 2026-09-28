import type { ReactNode } from 'react';
import { Typography } from '../typography';

type ResumeEventDetailsProps = { children: ReactNode };

const detailsStyles = { gridColumn: { sm: '1 / -1' }, fontStyle: 'italic' };

export function ResumeEventDetails(props: ResumeEventDetailsProps) {
  return (
    <Typography variant="body2" color="text.secondary" sx={detailsStyles}>
      {props.children}
    </Typography>
  );
}
