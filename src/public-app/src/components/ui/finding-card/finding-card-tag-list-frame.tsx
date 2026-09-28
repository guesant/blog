import type { ReactNode } from 'react';
import { Box } from '../box';

type FindingCardTagListFrameProps = { children: ReactNode };

const listStyles = {
  display: 'flex',
  flex: '1 1 auto',
  flexWrap: 'wrap',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  gap: 'var(--site-space-2)',
  textAlign: 'left',
};

export function FindingCardTagListFrame(props: FindingCardTagListFrameProps) {
  return <Box sx={listStyles}>{props.children}</Box>;
}
