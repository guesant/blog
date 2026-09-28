import type { ReactNode } from 'react';
import { Box } from '../box';

type CaseFeaturedFactsFrameProps = { children: ReactNode };

const factsStyles = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
  gap: 2.5,
  marginBlockStart: 3,
  paddingBlockStart: 3,
  borderTop: 1,
  borderColor: 'divider',
};

export function CaseFeaturedFactsFrame(props: CaseFeaturedFactsFrameProps) {
  return <Box sx={factsStyles}>{props.children}</Box>;
}
