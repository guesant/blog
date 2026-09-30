import type { ReactNode } from 'react';
import { Box } from '../box';

type FindingCardMetadataBlockProps = { children: ReactNode };

const blockStyles = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 'var(--site-gap-cluster)',
  width: '100%',
};

export function FindingCardMetadataBlock(props: FindingCardMetadataBlockProps) {
  return <Box sx={blockStyles}>{props.children}</Box>;
}
