import type { ReactNode } from 'react';
import { Typography } from '../typography';

type ResumeCaseSummaryProps = { children: ReactNode };

export function ResumeCaseSummary(props: ResumeCaseSummaryProps) {
  return (
    <Typography variant="body2" color="text.secondary">
      {props.children}
    </Typography>
  );
}
