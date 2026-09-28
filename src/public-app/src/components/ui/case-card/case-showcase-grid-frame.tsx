import type { ReactNode } from 'react';
import { Box } from '../box';

type CaseShowcaseGridFrameProps = { children: ReactNode };

const gridStyles = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
  gap: 2,
};

export function CaseShowcaseGridFrame(props: CaseShowcaseGridFrameProps) {
  return <Box sx={gridStyles}>{props.children}</Box>;
}
