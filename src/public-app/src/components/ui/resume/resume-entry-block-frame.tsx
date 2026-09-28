import type { ReactNode } from 'react';
import { Box } from '../box';

type ResumeEntryBlockFrameProps = { children: ReactNode };

const entryStyles = { display: 'grid', gap: 'var(--site-space-2)' };

export function ResumeEntryBlockFrame(props: ResumeEntryBlockFrameProps) {
  return <Box sx={entryStyles}>{props.children}</Box>;
}
