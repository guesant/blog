import type { ReactNode } from 'react';
import { Typography } from '../typography';

type CaseFactValueProps = { children: ReactNode };

const valueStyles = { fontSize: 'var(--site-text-sm)' };

export function CaseFactValue(props: CaseFactValueProps) {
  return <Typography sx={valueStyles}>{props.children}</Typography>;
}
