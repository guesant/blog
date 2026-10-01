import type { ReactNode } from 'react';
import { Box } from '../box';

type SidebarNavigationCompactFrameProps = {
  children: ReactNode;
  'aria-label'?: string;
};

export function SidebarNavigationCompactFrame(props: SidebarNavigationCompactFrameProps) {
  return (
    <Box
      component="nav"
      aria-label={props['aria-label']}
      sx={{
        width: '100%',
        padding: 0,
        minWidth: 0,
        minHeight: 0,
        flex: '0 0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--site-sidebar-gap)',
      }}
    >
      {props.children}
    </Box>
  );
}
