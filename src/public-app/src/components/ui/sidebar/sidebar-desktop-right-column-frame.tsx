import type { ReactNode } from 'react';
import { Box } from '../box';

export type SidebarDesktopRightColumnFrameProps = { children: ReactNode };

export function SidebarDesktopRightColumnFrame(props: SidebarDesktopRightColumnFrameProps) {
  return (
    <Box
      sx={{
        display: { xs: 'none', md: 'block' },
        borderLeft: 'var(--site-border-width) solid',
        borderColor: 'var(--site-border-strong)',
      }}
    >
      {props.children}
    </Box>
  );
}
