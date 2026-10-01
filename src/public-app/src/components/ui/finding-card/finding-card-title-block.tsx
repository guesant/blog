import type { ReactNode } from 'react';
import { Box } from '../box';

type FindingCardTitleBlockProps = {
  children: ReactNode;
  supporting?: ReactNode;
};

const blockStyles = {
  display: 'grid',
  gap: 'var(--site-space-2)',
  width: '100%',
};

export function FindingCardTitleBlock(props: FindingCardTitleBlockProps) {
  return (
    <Box sx={blockStyles}>
      {props.children}
      {props.supporting}
    </Box>
  );
}
