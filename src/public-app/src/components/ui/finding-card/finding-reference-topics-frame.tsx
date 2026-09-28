import type { ReactNode } from 'react';
import { Box } from '../box';

type FindingReferenceTopicsFrameProps = { children: ReactNode };

const topicsStyles = {
  paddingBlockStart: 'var(--site-space-2)',
  display: 'flex',
  flexWrap: 'wrap',
  gap: 'var(--site-space-1)',
};

export function FindingReferenceTopicsFrame(props: FindingReferenceTopicsFrameProps) {
  return <Box sx={topicsStyles}>{props.children}</Box>;
}
