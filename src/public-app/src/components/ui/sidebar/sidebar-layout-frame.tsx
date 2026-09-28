import type { ReactNode } from 'react';
import { Box } from '../box';

type SidebarLayoutFrameProps = { children: ReactNode; withRightSidebar: boolean };

const baseStyles = {
  minHeight: '100dvh',
  display: 'grid',
  bgcolor: 'var(--site-surface)',
};

export function SidebarLayoutFrame(props: SidebarLayoutFrameProps) {
  return (
    <Box
      sx={{
        ...baseStyles,
        gridTemplateColumns: {
          xs: '1fr',
          md: props.withRightSidebar ? '16rem minmax(0, 1fr) 16rem' : '16rem minmax(0, 1fr)',
        },
      }}
    >
      {props.children}
    </Box>
  );
}
