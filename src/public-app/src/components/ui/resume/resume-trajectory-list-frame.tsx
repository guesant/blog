import type { ReactNode } from 'react';
import { Box } from '../box';

type ResumeTrajectoryListFrameProps = { children: ReactNode };

const listStyles = { display: 'grid', gap: 3 };

export function ResumeTrajectoryListFrame(props: ResumeTrajectoryListFrameProps) {
  return <Box sx={listStyles}>{props.children}</Box>;
}
