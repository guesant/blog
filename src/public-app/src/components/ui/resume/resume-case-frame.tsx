import type { ReactNode } from 'react';
import { Box } from '../box';

type ResumeCaseFrameProps = { children: ReactNode };

const caseStyles = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', sm: '1fr auto' },
  columnGap: 3,
  rowGap: 0.25,
};

export function ResumeCaseFrame(props: ResumeCaseFrameProps) {
  return <Box sx={caseStyles}>{props.children}</Box>;
}
