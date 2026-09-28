import type { ReactNode } from 'react';
import { Box } from '../box';

type ResumeEntryBlockFrameProps = { children: ReactNode };

export function ResumeEntryBlockFrame(props: ResumeEntryBlockFrameProps) {
  return <Box>{props.children}</Box>;
}
