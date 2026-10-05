import type { ReactNode } from 'react';
import { Box } from '../box';

type SidebarNavigationExpandedFrameProps = {
  children: ReactNode;
  'aria-label'?: string;
};

export function SidebarNavigationExpandedFrame(props: SidebarNavigationExpandedFrameProps) {
  return (
    <Box
      component="nav"
      aria-label={props['aria-label']}
      sx={{
        width: '100%',
        padding: 'var(--site-space-3)',
        minWidth: 0,
        minHeight: 'var(--site-viewport-min-height)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--site-sidebar-gap)',
      }}
    >
      {props.children}
    </Box>
  );
}
