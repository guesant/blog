import type { ReactNode } from 'react';
import { Box } from '../box';

type ResumeEntryGridFrameProps = { children: ReactNode };

const gridStyles = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', sm: '1fr auto' },
  columnGap: 3,
  rowGap: 0.25,
};

export function ResumeEntryGridFrame(props: ResumeEntryGridFrameProps) {
  return <Box sx={gridStyles}>{props.children}</Box>;
}
