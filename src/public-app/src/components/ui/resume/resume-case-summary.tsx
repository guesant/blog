import type { ReactNode } from 'react';
import { Typography } from '../typography';

type ResumeCaseSummaryProps = { children: ReactNode };

const summaryStyles = { marginBlockStart: 'var(--site-space-2)' };

export function ResumeCaseSummary(props: ResumeCaseSummaryProps) {
  return (
    <Typography variant="body2" color="text.secondary" sx={summaryStyles}>
      {props.children}
    </Typography>
  );
}
