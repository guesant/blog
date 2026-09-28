import type { ReactNode } from 'react';
import { Box } from '../box';

type ResumeWorkListFrameProps = { children: ReactNode };

const listStyles = { display: 'grid', gap: 3 };

export function ResumeWorkListFrame(props: ResumeWorkListFrameProps) {
  return <Box sx={listStyles}>{props.children}</Box>;
}
