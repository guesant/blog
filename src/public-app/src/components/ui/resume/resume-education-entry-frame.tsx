import type { ReactNode } from 'react';
import { Box } from '../box';

type ResumeEducationEntryFrameProps = { children: ReactNode };

const entryStyles = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', sm: '1fr auto' },
  columnGap: 3,
  rowGap: 0.25,
};

export function ResumeEducationEntryFrame(props: ResumeEducationEntryFrameProps) {
  return <Box sx={entryStyles}>{props.children}</Box>;
}
