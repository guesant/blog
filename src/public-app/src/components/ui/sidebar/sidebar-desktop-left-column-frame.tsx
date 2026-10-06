import type { ReactNode } from 'react';
import { Box } from '../box';

export type SidebarDesktopLeftColumnFrameProps = { children: ReactNode };

export function SidebarDesktopLeftColumnFrame(props: SidebarDesktopLeftColumnFrameProps) {
  return (
    <Box
      data-navigation-sidebar
      sx={{
        display: { xs: 'none', md: 'block' },
        borderRight: 'var(--site-border-width) solid',
        borderColor: 'var(--site-border-strong)',
      }}
    >
      {props.children}
    </Box>
  );
}
