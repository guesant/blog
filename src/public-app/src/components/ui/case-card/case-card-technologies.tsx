import type { ReactNode } from 'react';
import { Typography } from '../typography';

type CaseCardTechnologiesProps = { children: ReactNode };

export function CaseCardTechnologies(props: CaseCardTechnologiesProps) {
  return (
    <Typography sx={{ color: 'text.secondary', fontSize: 'var(--site-text-sm)' }}>
      {props.children}
    </Typography>
  );
}
