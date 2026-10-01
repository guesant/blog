import type { ReactNode } from 'react';
import { Box } from '../box';

type FindingCardTitleFrameProps = {
  children: ReactNode;
  leading: ReactNode;
};

const frameStyles = {
  display: 'grid',
  gridTemplateColumns: 'auto minmax(0, 1fr)',
  alignItems: 'start',
  columnGap: 'var(--site-gap-cluster)',
  width: '100%',
};

export function FindingCardTitleFrame(props: FindingCardTitleFrameProps) {
  return (
    <Box sx={frameStyles}>
      {props.leading}
      {props.children}
    </Box>
  );
}
