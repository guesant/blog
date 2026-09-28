import type { ReactNode } from 'react';
import { Box } from '../box';

type FindingCardFooterFrameProps = { children: ReactNode };

const footerStyles = {
  paddingBlockStart: 'var(--site-space-4)',
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: { xs: 'flex-start', sm: 'space-between' },
  rowGap: 'var(--site-gap-stack)',
  columnGap: 'var(--site-gap-cluster)',
  borderTop: 'var(--site-border-width) solid var(--site-border)',
};

export function FindingCardFooterFrame(props: FindingCardFooterFrameProps) {
  return <Box sx={footerStyles}>{props.children}</Box>;
}
