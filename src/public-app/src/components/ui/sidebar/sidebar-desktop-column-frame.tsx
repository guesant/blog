import type { ReactNode } from 'react';
import { Box } from '../box';

type SidebarDesktopColumnFrameProps = { children: ReactNode; side: 'left' | 'right' };

const sideStyles = {
  left: {
    borderRight: 'var(--site-border-width) solid',
    borderColor: 'var(--site-border-strong)',
  },
  right: {
    borderLeft: 'var(--site-border-width) solid',
    borderColor: 'var(--site-border-strong)',
  },
};

export function SidebarDesktopColumnFrame(props: SidebarDesktopColumnFrameProps) {
  return (
    <Box sx={{ display: { xs: 'none', md: 'block' }, ...sideStyles[props.side] }}>
      {props.children}
    </Box>
  );
}
