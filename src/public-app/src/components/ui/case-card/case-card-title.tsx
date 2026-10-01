import type { ReactNode } from 'react';
import { Typography } from '../typography';

type CaseCardTitleProps = { children: ReactNode; component: 'h2' | 'h3' };

export function CaseCardTitle(props: CaseCardTitleProps) {
  return (
    <Typography
      component={props.component}
      sx={{ fontSize: 'var(--site-text-xl)', transition: 'color .2s' }}
      className="case-title case-link-title"
    >
      {props.children}
    </Typography>
  );
}
