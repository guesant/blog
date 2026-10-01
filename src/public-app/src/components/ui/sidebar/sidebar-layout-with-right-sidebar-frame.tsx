import type { ReactNode } from 'react';
import { Box } from '../box';

type SidebarLayoutWithRightSidebarFrameProps = { children: ReactNode };

const baseStyles = {
  minHeight: '100dvh',
  display: 'grid',
  bgcolor: 'var(--site-surface)',
};

export function SidebarLayoutWithRightSidebarFrame(props: SidebarLayoutWithRightSidebarFrameProps) {
  return (
    <Box
      sx={{
        ...baseStyles,
        gridTemplateColumns: { xs: '1fr', md: '16rem minmax(0, 1fr) 16rem' },
      }}
    >
      {props.children}
    </Box>
  );
}
