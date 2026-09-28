import type { ReactNode } from 'react';
import { Typography } from '../typography';

type ResumeCredentialIssuerProps = { children: ReactNode };

const issuerStyles = { fontStyle: 'italic' };

export function ResumeCredentialIssuer(props: ResumeCredentialIssuerProps) {
  return (
    <Typography variant="body2" color="text.secondary" sx={issuerStyles}>
      {props.children}
    </Typography>
  );
}
