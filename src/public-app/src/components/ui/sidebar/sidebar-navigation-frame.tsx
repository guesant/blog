import type { ReactNode } from 'react';
import { Box } from '../box';

type SidebarNavigationFrameProps = {
  children: ReactNode;
  compact: boolean;
  'aria-label'?: string;
};

export function SidebarNavigationFrame(props: SidebarNavigationFrameProps) {
  return (
    <Box
      component="nav"
      aria-label={props['aria-label']}
      sx={{
        padding: props.compact ? 0 : 'var(--site-space-3)',
        minWidth: 0,
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {props.children}
    </Box>
  );
}
