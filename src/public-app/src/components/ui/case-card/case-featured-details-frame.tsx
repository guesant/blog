import type { ReactNode } from 'react';
import { Box } from '../box';

type CaseFeaturedDetailsFrameProps = { children: ReactNode };

const detailsStyles = {
  padding: { xs: 3, md: 4 },
  display: 'flex',
  flexDirection: 'column',
};

export function CaseFeaturedDetailsFrame(props: CaseFeaturedDetailsFrameProps) {
  return <Box sx={detailsStyles}>{props.children}</Box>;
}
