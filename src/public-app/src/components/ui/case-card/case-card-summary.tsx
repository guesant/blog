import type { ReactNode } from 'react';
import { Typography } from '../typography';

type CaseCardSummaryProps = { children: ReactNode };

export function CaseCardSummary(props: CaseCardSummaryProps) {
  return (
    <Typography color="text.secondary" sx={{ maxWidth: '58ch', fontSize: 'var(--site-text-body)' }}>
      {props.children}
    </Typography>
  );
}
