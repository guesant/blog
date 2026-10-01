import type { ReactNode } from 'react';
import { Typography } from '../typography';

type CaseCardReadActionProps = { children: ReactNode };

export function CaseCardReadAction(props: CaseCardReadActionProps) {
  return (
    <Typography
      color="secondary"
      sx={{
        display: 'inline-flex',
        gap: 'var(--site-space-2)',
        alignItems: 'center',
        fontWeight: 'var(--site-weight-semibold)',
      }}
    >
      {props.children}
    </Typography>
  );
}
