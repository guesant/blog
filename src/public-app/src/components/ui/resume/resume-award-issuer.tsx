import type { ReactNode } from 'react';
import { Typography } from '../typography';

type ResumeAwardIssuerProps = { children: ReactNode };

const issuerStyles = { gridColumn: { sm: '1 / -1' }, fontStyle: 'italic' };

export function ResumeAwardIssuer(props: ResumeAwardIssuerProps) {
  return (
    <Typography variant="body2" color="text.secondary" sx={issuerStyles}>
      {props.children}
    </Typography>
  );
}
