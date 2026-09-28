import type { ReactNode } from 'react';
import { Box } from '../box';

type CaseFactFrameProps = { children: ReactNode };

export function CaseFactFrame(props: CaseFactFrameProps) {
  return <Box sx={{ display: 'grid', gap: 'var(--site-space-2)' }}>{props.children}</Box>;
}
