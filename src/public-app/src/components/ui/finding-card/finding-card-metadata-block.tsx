import type { ReactNode } from 'react';
import { Box } from '../box';

type FindingCardMetadataBlockProps = { children: ReactNode };

const blockStyles = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: 'var(--site-space-2)',
  width: '100%',
};

export function FindingCardMetadataBlock(props: FindingCardMetadataBlockProps) {
  return <Box sx={blockStyles}>{props.children}</Box>;
}
