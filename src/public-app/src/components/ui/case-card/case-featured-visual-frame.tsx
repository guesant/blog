import type { ReactNode } from 'react';
import { Box } from '../box';

type CaseFeaturedVisualFrameProps = { children: ReactNode };

const visualStyles = {
  padding: { xs: 2, sm: 3 },
  display: 'grid',
  alignItems: 'center',
  backgroundColor: '#eef2f8',
  borderRight: { md: 1 },
  borderBottom: { xs: 1, md: 0 },
  borderColor: 'divider',
};

export function CaseFeaturedVisualFrame(props: CaseFeaturedVisualFrameProps) {
  return <Box sx={visualStyles}>{props.children}</Box>;
}
