import type { ReactNode } from 'react';
import { Typography } from '../typography';

type CaseFactLabelProps = { children: ReactNode };

const labelStyles = {
  fontSize: 'var(--site-text-xs)',
  fontWeight: 'var(--site-weight-semibold)',
  color: 'var(--site-text-secondary)',
};

export function CaseFactLabel(props: CaseFactLabelProps) {
  return <Typography sx={labelStyles}>{props.children}</Typography>;
}
